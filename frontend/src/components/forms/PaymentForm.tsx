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
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe has not initialized yet.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      console.error("CardNumberElement not found!");
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
          Printer();
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
        console.error("Error: ", backendError.response);
      }
    } else {
      console.log(error.message);
      return;
    }

    //update the points on the rewardsMember
    if (isRewardsMember) {
      let newPoints = Math.floor(0.1 * totalAmount); //points are just 10% of the total amount, may change later
      try {
        let response = await fetch(
          config.baseApiUrl + "/rewards-member-check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phoneNumber }),

          },

        );

        let data = await response.json();

        if (data && data.exists) {
          newPoints = data.points + newPoints;
        }

        response = await fetch(config.baseApiUrl + "/rewards-member-update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber, newPoints }),
        });
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error(

          `Could not update points for the rewards member! ${errorMessage}`,

        );
      }
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

            className="p-2 border border-gray-200 rounded w-full" />

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

        </div>
        {/* ZIP */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Zip
          </label>
          <input type="text" className="p-2 border border-gray-200 rounded w-full" placeholder="ZIP" pattern="\d{5}" maxLength={5}inputMode="numeric"  />

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
