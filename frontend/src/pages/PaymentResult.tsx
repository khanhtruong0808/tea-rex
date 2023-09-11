import { useLocation } from 'react-router-dom';

function PaymentResult() {
    const location = useLocation();
    const paymentSuccess = location.state?.success;

    return (
        <div>
            {paymentSuccess ? "Payment was successful!" : "Payment failed."}
        </div>
    );
};
export default PaymentResult;