import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./forms/PaymentForm";
import { config } from "../config";

const stripePromise = loadStripe(config.stripePublicKey);

interface StripeContainerProps {
  totalAmount: number;
  className?: string;
  onCancelCheckout: () => void;
  isRewardsMember: boolean;
  phoneNumber: string;
}

const StripeContainer = ({
  totalAmount,
  className,
  onCancelCheckout,
  isRewardsMember,
  phoneNumber,
}: StripeContainerProps) => {
  return (
    <div className={className}>
      <Elements stripe={stripePromise}>
        <PaymentForm
          totalAmount={totalAmount}
          cancelCheckout={onCancelCheckout}
          isRewardsMember={isRewardsMember}
          phoneNumber={phoneNumber}
        />
      </Elements>
    </div>
  );
};

export default StripeContainer;
