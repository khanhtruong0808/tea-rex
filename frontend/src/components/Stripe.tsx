import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./forms/PaymentForm";
const PUBLIC_KEY = import.meta.env.STRIPE_PUBLIC_KEY;

//const stripePromise = loadStripe(`${PUBLIC_KEY}`); // string interpolation to fix error saying apiUrl needs to be string
const stripePromise = loadStripe("pk_test_51NoVQjEUsn4T1wuaoOCAN4Xcx70IjeP5PqGSZc0mCPl6xdaBRb7FpcHU2GfPXD4bQ9ta9WfaUuBHpbnRdRANl8YL00OBTGkKYQ");
interface StripeContainerProps {
  totalAmount: number;
  className?: string;
  onCancelCheckout: () => void;
  isRewardsMember: boolean;
  phoneNumber: string;
};

const StripeContainer = ({ totalAmount, className, onCancelCheckout,
isRewardsMember, phoneNumber}: StripeContainerProps) => {
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
