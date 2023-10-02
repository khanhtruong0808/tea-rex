import { useShoppingCart } from "../components/ShoppingCartContext";
import Stripe from "../components/Stripe";
import RewardsSystemForm from "../components/forms/RewardsSystemForm";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
      <Dialog as="div" className="relative z-10" onClose={closeCart}>
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
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={closeCart}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                        Panel title
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6 w-96">
                      <div className="relative flex flex-col">
                        <div className="flex flex-col">
                          {isCheckingOut && (
                            <>
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
                            </>
                          )}
                          <div
                            className={
                              isCheckingOut ? "w-1/2 p-5" : "w-full p-5"
                            }
                            border-solid="true"
                            border-black="true"
                          >
                            <div className="relative flex flex-col w-96">
                              <div className="w-9/12 mx-auto p-5 max-w-lg border-solid border-black">
                                {cart.map((item, id) => (
                                  <>
                                    <article key={id} className="my-2 relative">
                                      <h1 className="text-left w-3/4 self-center inline-block font-semibold text-base whitespace-nowrap">
                                        {item.item.name}
                                      </h1>
                                      <h1 className="text-right w-1/4 pr-4 self-center inline-block font-semibold text-base">
                                        ${item.item.price}
                                      </h1>
                                    </article>

                                    <article>
                                      {item.option.map((options) => (
                                        <>
                                          <p className="text-left inline-block font-semibold text-xs">
                                            {options.qty}
                                          </p>
                                          <p className="text-left pl-4 inline-block font-semibold text-xs">
                                            {options.name}
                                          </p>
                                          <br />
                                        </>
                                      ))}

                                      <p className="text-left inline-block font-semibold text-xs">
                                        {item.spice.qty}
                                      </p>
                                      <p className="text-left pl-4 inline-block font-semibold text-xs">
                                        {item.spice.name}
                                      </p>
                                    </article>
                                  </>
                                ))}
                              </div>

                              <div className="w-9/12 mx-auto p-5 max-w-lg border-solid border-black">
                                <hr className="bg-black border-black h-0.5 mr-32"></hr>
                                <article>
                                  <p className="w-3/6 self center font-bold text-left inline-block text-sm">
                                    Subtotal:
                                  </p>
                                  <p className="text-right w-1/4 pr-4 self-center inline-block font-bold text-sm">
                                    ${subtotal.toFixed(2)}
                                  </p>
                                </article>
                                <article>
                                  <p className="w-3/6 self center font-bold text-left inline-block text-sm">
                                    Discount:
                                  </p>
                                  <p className="text-right w-1/4 pr-4 self-center inline-block font-bold text-sm">
                                    ${discount.toFixed(2)}
                                  </p>
                                </article>
                                <article>
                                  <p className="w-3/6 self center font-bold text-left inline-block text-sm">
                                    Tax:
                                  </p>
                                  <p className="text-right w-1/4 pr-4 self-center inline-block font-bold text-sm">
                                    ${tax.toFixed(2)}
                                  </p>
                                </article>
                                <article>
                                  <p className="w-3/6 self center font-bold text-left inline-block text-sm">
                                    Total:
                                  </p>
                                  <p className="text-right w-1/4 pr-4 self-center inline-block font-bold text-sm">
                                    ${total.toFixed(2)}
                                  </p>
                                </article>

                                {!isCheckingOut && (
                                  <>
                                    <button
                                      className="float-left mt-4 inline font-semibold bg-gray-500 hover:bg-gray-700 text-white px-2 pb-1 rounded-full text-sm"
                                      onClick={() => clearCart()}
                                    >
                                      Clear Cart
                                    </button>
                                    <button
                                      className="float-right mt-4  inline font-semibold bg-lime-700 hover:scale-110 transition lg:block text-white px-2 pb-1 rounded-full whitespace-nowrap text-sm"
                                      onClick={() => setIsCheckingOut(true)}
                                    >
                                      Proceed to Checkout
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
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
