import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./forms/PaymentForm";
const PUBLIC_KEY = import.meta.env.STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(`${PUBLIC_KEY}`); // string interprolation to fix error saying apiUrl needs to be string

type StripeContainerProps = {
  totalAmount: number;
  className?: string;
  onCancelCheckout: () => void;
};

const StripeContainer: React.FC<StripeContainerProps> = ({
  totalAmount,
  className,
  onCancelCheckout,
}) => {
  return (
    <div className={className}>
      <Elements stripe={stripePromise}>
        <PaymentForm
          totalAmount={totalAmount}
          cancelCheckout={onCancelCheckout}
        />
      </Elements>
    </div>
  );
};

export default StripeContainer;
