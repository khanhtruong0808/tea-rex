import React, {FormEvent, useState} from 'react'
import { CardElement, CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe} from "@stripe/react-stripe-js"
import { StripeCardElement, StripeCardNumberElementOptions} from "@stripe/stripe-js";
import { StripeCardNumberElementChangeEvent } from '@stripe/stripe-js';
import axios from "axios"

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#fffff",
			color: "#fffff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { 
                color: "#000", 
                backgroundColor: "transparent" 
            },
			"::placeholder": { color: "#87bbfd" }
		},
        invalid: {
            iconColor: "#ffc7ee",
            color: "#ffc7ee"
        }
	},
    showIcon: true
};

type PaymentFormProps = {
    totalAmount: number;
}

const PaymentForm = ({totalAmount} : PaymentFormProps) => {
    const[success, setSuccess] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!stripe || !elements) {
            console.error("Stripe has not initialized yet.");
            return;
        }
    
        const cardElement = elements.getElement(CardElement) as StripeCardElement;
    
        if (!cardElement) {
            console.error("CardElement not found!");
            return;
        }
        
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement
        });
    
        if (error) {
            console.log(error.message);
            return;
        }

        try {
            const response = await axios.post("/payment", {
                amount: totalAmount,
                id: paymentMethod.id
            });
    
            if (response.data.success) {
                console.log("successful payment");
                setSuccess(true);
            } else {
                console.error("Payment failed on the backend");
            }
        } catch (backendError) {
            console.error("Error:", backendError);
        }
    };

    return (
        <>
        {!success ? (
            <form onSubmit={handleSubmit}>
                <fieldset className="border border-gray-300 p-4 rounded-md">
                {/* Card Number */}
                <div className="mb-4 relative">
                    <label 
                    className="block text-sm font-medium text-gray-600 mb-2">
                        Card Number
                    </label>
                    <CardNumberElement 
                        options={CARD_OPTIONS as StripeCardNumberElementOptions} 
                        className="p-2 border border-gray-200 rounded w-full"/>
                    <span 
                        className="absolute top-1/2 right-10 transform -translate-y-1/2">
                    </span>
                </div>
                {/* Expiration Date */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Expiration Date</label>
                    <CardExpiryElement 
                        options={CARD_OPTIONS as StripeCardNumberElementOptions} 
                        className="p-2 border border-gray-200 rounded w-full"/>
                </div>
                {/* CVV */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">CVV</label>
                    <CardCvcElement 
                    options={CARD_OPTIONS as StripeCardNumberElementOptions} 
                    className="p-2 border border-gray-200 rounded w-full"/>
                </div>
                </fieldset>
            <button 
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" >Pay</button>
        </form>
        ) : (
            <div className="text-center mt-6">
                <h2 className="text-xl font-semibold">You just bought something</h2>
            </div>
            )}
            </>
        )
};

export default PaymentForm;