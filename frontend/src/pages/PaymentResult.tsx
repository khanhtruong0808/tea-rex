import { useLocation } from "react-router-dom";

function PaymentResult() {
  const location = useLocation();
  const paymentSuccess = location.state?.success;
  const orderId = location.state?.orderId;
  const name = location.state?.name;

  return (
    <div className="flex flex-col items-center justify-center">
      {paymentSuccess ? (
        <div className="flex flex-col items-center justify-center">
          <img
            className="w-80 object-contain pt-5 md:w-96"
            src={"tea-rex-logos/happy-tea-rex.webp"}
          />
          <div className="w-fit px-4 text-center">
            <p className="font-description text-3xl">Order received!</p>
            <p className="text-lg font-bold text-gray-900">
              Thank you. Your order is in progress.
            </p>
            <p className="mt-4 text-lg font-medium text-gray-600">
              We'll see you at 2475 Elk Grove Blvd #150, Elk Grove, CA 95758
            </p>
            <p className="text-lg font-medium text-gray-600">
              Pickup for: {name}
            </p>
            <p className="text-lg font-medium text-gray-600">
              Order id: {orderId}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative mb-4 flex w-3/4 flex-col items-center">
            <img
              className="w-1/2 object-contain"
              src={"tea-rex-logos/sad-tea-rex.webp"}
            />
            <div className="center font-description text-l absolute mb-10 md:text-3xl">
              Payment failed!
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default PaymentResult;
