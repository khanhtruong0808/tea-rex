import React from 'react'
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentForm from './forms/PaymentForm'
const PUBLIC_KEY = "pk_test_51NoVQjEUsn4T1wuaoOCAN4Xcx70IjeP5PqGSZc0mCPl6xdaBRb7FpcHU2GfPXD4bQ9ta9WfaUuBHpbnRdRANl8YL00OBTGkKYQ" // used for testing purposes, put in .env later...

const stripePromise = loadStripe(PUBLIC_KEY)

type StripeContainerProps = {
    totalAmount: number;
};

const StripeContainer: React.FC<StripeContainerProps> = ({ totalAmount }) => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm totalAmount={totalAmount} />
        </Elements>
    );
};

export default StripeContainer