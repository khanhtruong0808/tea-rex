import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeCardNumberElementOptions } from "@stripe/stripe-js";
import { config } from "../../config";
import GoogleMap from "../GoogleMap";
import { Printer } from "../Printer";
import useAlert from "../AlertMessageContext";
import useRewards from "../RewardsContext";
import { useShoppingCart } from "../ShoppingCartProvider";

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
        backgroundColor: "transparent",
      },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
  showIcon: true,
};

interface PaymentFormProps {
  totalAmount: number;
  cancelCheckout: () => void;
  isRewardsMember: boolean;
  phoneNumber: string;
}

const PaymentForm = ({
  totalAmount,
  cancelCheckout,
  isRewardsMember,
  phoneNumber,
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { handleAddPoints } = useRewards();
  const { showAlert } = useAlert();
  const { hasBeverages } = useShoppingCart();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe has not initialized yet.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      showAlert("No card number found!", "error");
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    if (!error) {
      try {
        console.log("Total amount: " + totalAmount);
        const response = await fetch(config.baseApiUrl + "/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalAmount,
            id: paymentMethod.id,
          }),
        });

        const responseData = await response.json();

        if (responseData.success) {
          //Printer(); //if enabled during development, payments will go through but you will get a backend error:
          /*
          Error:  undefined Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
          /*
          1. You might have mismatching versions of React and the renderer (such as React DOM)
          2. You might be breaking the Rules of Hooks
          3. You might have more than one copy of React in the same app
          See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem. 
          */
          console.log("successful payment");
          navigate("/payment-result", {
            state: {
              success: responseData.success,
            },
          });
        } else {
          console.error("Payment failed on the backend");
          console.log(responseData);
        }
      } catch (backendError: any) {
        console.error("Error: ", backendError.response, backendError.message);
      }
    } else {
      console.log(error.message);
      return;
    }

    //update the points on the rewardsMember
    if (isRewardsMember && hasBeverages) {
      handleAddPoints(totalAmount / 100);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="border border-gray-300 p-4 rounded-md">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Pick up location: <br />
            2475 Elk Grove Blvd #150, Elk Grove, CA 95758
            <GoogleMap width="100%" />
          </label>
        </div>
        {/* Name */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Name
          </label>
          <input
            type="text"
            placeholder="Name on Card"
            className="p-2 border border-gray-200 rounded w-full"
          />
        </div>
        {/* Card Number */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Card Number
          </label>
          <CardNumberElement
            options={CARD_OPTIONS as StripeCardNumberElementOptions}
            className="p-2 border border-gray-200 rounded w-full"
          />
          <span className="absolute top-1/2 right-10 transform -translate-y-1/2"></span>
        </div>
        {/* Expiration Date, CVV*/}
        <div className="mb-4 w-full flex">
          {/* Expiration Date */}
          <div className="flex-grow mr-3">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Expiration Date
            </label>
            <CardExpiryElement className="p-3 border border-gray-200 rounded w-full" />
          </div>
          {/* CVV */}
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-600 mb-2 ">
              CVC
            </label>
            <CardCvcElement className="p-3 border border-gray-200 rounded w-full" />
          </div>
          {/* ZIP */}
          <div className="flex-1 mr-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Zip
            </label>
            <input
              type="text"
              className="p-2 border border-gray-200 rounded w-full"
              placeholder="ZIP"
              pattern="\d{5}"
              maxLength={5}
              inputMode="numeric"
            />
          </div>
        </div>
      </fieldset>
      <div className="flex mt-4 space-x-2">
        <button className="bg-lime-700 text-white font-semibold py-2 px-4 rounded hover:scale-110 transition lg:block">
          Pay
        </button>
        <button
          type="button"
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:scale-110 transition lg:block"
          onClick={cancelCheckout}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
