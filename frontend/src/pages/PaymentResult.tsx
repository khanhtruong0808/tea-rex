import { useLocation } from "react-router-dom";

function PaymentResult() {
  const location = useLocation();
  const paymentSuccess = location.state?.success;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {paymentSuccess ? (
        <div className="relative flex flex-col items-center w-3/4 mb-4">
          <img
            className="w-1/2 md:w-3/4 object-contain"
            src={"/happy-tea-rex.png"}
          />
          <div className="absolute center mb-10 font-description text-l md:text-3xl">
            Payment was successful!
          </div>
        </div>
      ) : (
        <>
          <div className="relative flex flex-col items-center w-3/4 mb-4">
            <img className="w-1/2 object-contain" src={"/sad-tea-rex.png"} />
            <div className="absolute center mb-10 font-description text-l md:text-3xl">
              Payment failed!
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default PaymentResult;
