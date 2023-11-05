import { useShoppingCart } from "../components/ShoppingCartProvider";
import RewardsSystemForm from "../components/forms/RewardsSystemForm";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AlertProvider } from "../components/AlertMessageContext";
import { ShoppingCartList } from "../components/ShoppingCartList";
import PaymentForm from "../components/forms/PaymentForm";
import Map from "../components/Map";
import { Spinner } from "../utils/Spinner";
import { config } from "../config";

export default function Cart() {
  const {
    cartItems,
    addToCart,
    closeCart,
    discount,
    updateSubtotal,
    updateFinaltotal,
    subtotal,
    tax,
    updateTax,
    finaltotal,
    isExternalTaxSet,
    isEmpty,
  } = useShoppingCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isRewardsMember, setIsRewardsMember] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmitRef = useRef<(() => Promise<void>) | null>(null);

  const handleCancel = () => {
    setIsCheckingOut(false);
  };

  const handlePlaceOrder = async () => {
    if (
      handleSubmitRef.current &&
      typeof handleSubmitRef.current === "function"
    ) {
      await handleSubmitRef.current();
    }
  };

  const newSubtotal = cartItems.reduce((acc: number, item) => {
    const itemPrice = Number(item.item.price) * item.quantity;
    const optionsTotal = item.option.reduce(
      (optionAccumulator: number, option) => {
        const optionPrice = option.price
          ? Number(option.price) * option.qty
          : 0;
        return optionAccumulator + optionPrice;
      },
      0,
    );
    return acc + itemPrice + optionsTotal;
  }, 0);

  useEffect(() => {
    if (!isExternalTaxSet) {
      updateSubtotal(newSubtotal);
      updateTax((subtotal - discount) * config.taxRate);
      updateFinaltotal(subtotal - discount + tax);
    }
  }, [addToCart, discount]);

  useEffect(() => {
    updateFinaltotal(subtotal - discount + tax);
  }, [subtotal, discount, tax]);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="flex items-start justify-between">
          <Dialog.Title className="text-lg font-medium text-gray-900">
            Your order ({cartItems.length})
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
          cartItems={cartItems}
          className={isCheckingOut ? "hidden" : ""}
        />
        {isEmpty && (
          <div className="mt-10 flex flex-grow flex-col items-center justify-center">
            <p className="text-xl font-medium text-gray-900">
              {" "}
              No items in cart!{" "}
            </p>
            <img
              src="tea-rex-logos/sad-tea-rex-empty-cart.webp"
              alt="Empty Cart"
            />
          </div>
        )}
        <div
          className={`${isCheckingOut ? "" : "hidden"} mt-8 h-full bg-white`}
        >
          <div className="w-full space-y-8">
            <div className="mb-2 block space-y-2 text-sm font-semibold text-gray-600">
              <div>
                <h2 className="text-lg font-medium text-black">
                  Pick up location
                </h2>
                <p>2475 Elk Grove Blvd #150</p>
                <p>Elk Grove, CA 95758</p>
              </div>
              <Map width="100%" />
            </div>
            <AlertProvider>
              <RewardsSystemForm
                subtotal={Number(subtotal.toFixed(2))}
                total={subtotal}
                setIsRewardsMember={setIsRewardsMember}
                setRewardsMemberPhoneNumber={setPhoneNumber}
              />
            </AlertProvider>
            <PaymentForm
              cancelCheckout={handleCancel}
              isRewardsMember={isRewardsMember}
              phoneNumber={phoneNumber}
              setLoading={setLoading}
              setHandleSubmit={(func: any) => (handleSubmitRef.current = func)}
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
          <p>${finaltotal.toFixed(2)}</p>
        </div>
        {!isCheckingOut ? (
          <div className="mt-6">
            <button
              onClick={() => setIsCheckingOut(true)}
              disabled={cartItems.length === 0}
              className="disabled:hover-none flex w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:enabled:bg-lime-700 disabled:cursor-not-allowed disabled:bg-opacity-50"
            >
              Checkout
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              className="disabled:hover-none flex w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:enabled:bg-lime-700 disabled:cursor-not-allowed disabled:bg-opacity-50"
            >
              {loading ? <Spinner /> : "Place your order"}
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
    </>
  );
}
