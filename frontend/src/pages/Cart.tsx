import { useShoppingCart } from "../components/ShoppingCartContext";
import Stripe from "../components/Stripe";
import RewardsSystemForm from "../components/forms/RewardsSystemForm";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ShoppingCartList } from "../components/ShoppingCartList";

type CartProps = {
  isOpen: boolean;
};

export default function Cart({ isOpen }: CartProps) {
  const { cartItems, clearCart, closeCart } = useShoppingCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isRewardsMember, setIsRewardsMember] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [discount, setDiscount] = useState(0);
  const cart = cartItems;
  const updateDiscount = (newDiscount: number) => {
    setDiscount(newDiscount);
  };
  const handleCancel = () => {
    setIsCheckingOut(false);
  };

  const subtotal = cart.reduce((acc: number, item) => {
    const itemPrice = Number(item.item.price);

    const optionsTotal = item.option.reduce(
      (optionAccumulator: number, option) => {
        console.log(option);
        const optionPrice = option.price
          ? Number(option.price) * option.qty
          : 0;
        return optionAccumulator + optionPrice;
      },
      0
    );

    return acc + itemPrice + optionsTotal;
  }, 0);

  const adjustedSubtotal = subtotal - discount;
  const tax = adjustedSubtotal * 0.0875;
  const total = adjustedSubtotal + tax;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={closeCart}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* hidden/shown using CSS to conserve state, not sure if this be implemented this way*/}
                      <ShoppingCartList
                        cartItems={cart}
                        className={isCheckingOut ? "hidden" : ""}
                      />
                      <div
                        className={`${
                          isCheckingOut ? "" : "hidden"
                        } bg-white h-full`}
                      >
                        <div className="w-full p-5">
                          <Stripe
                            totalAmount={Number(total.toFixed(2)) * 100}
                            onCancelCheckout={handleCancel}
                            isRewardsMember={isRewardsMember}
                            phoneNumber={phoneNumber}
                          />
                        </div>
                        <div className="w-full p-5">
                          <RewardsSystemForm
                            subtotal={Number(subtotal.toFixed(2))}
                            total={total}
                            currDiscount={discount}
                            updateDiscount={updateDiscount}
                            setIsRewardsMember={setIsRewardsMember}
                            setRewardsMemberPhoneNumber={setPhoneNumber}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-sm font-medium text-gray-600">
                        <p>Subtotal</p>
                        <p>${subtotal.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-gray-600">
                        <p>Tax</p>
                        <p>${tax.toFixed(2)}</p>
                      </div>
                      {discount ? (
                        <div className="flex justify-between text-sm font-medium text-green-600">
                          <p>Discount</p>
                          <p>- ${discount.toFixed(2)}</p>
                        </div>
                      ) : null}
                      <div className="flex justify-between text-lg font-medium text-gray-900">
                        <p>Total</p>
                        <p>${total.toFixed(2)}</p>
                      </div>
                      {!isCheckingOut && (
                        <div className="mt-6">
                          <button
                            onClick={() => setIsCheckingOut(true)}
                            disabled={cart.length === 0}
                            className="w-full flex items-center justify-center rounded-md border border-transparent bg-lime-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:enabled:bg-lime-700 disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:hover-none"
                          >
                            Checkout
                          </button>
                        </div>
                      )}
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{" "}
                          <button
                            type="button"
                            className="font-medium text-lime-600 hover:text-lime-500"
                            onClick={closeCart}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
