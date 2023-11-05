import { useLocation } from "react-router-dom";

function PaymentResult() {
  const location = useLocation();
  const paymentSuccess = location.state?.success;

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {paymentSuccess ? (
        <div className="relative mb-4 flex w-3/4 flex-col items-center">
          <img
            className="w-1/2 object-contain md:w-3/4"
            src={"tea-rex-logos/happy-tea-rex.webp"}
          />
          <div className="center font-description text-l absolute mb-10 md:text-3xl">
            Payment was successful!
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
