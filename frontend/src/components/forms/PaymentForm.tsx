import { FormEvent, useEffect, useState } from "react";
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
  cancelCheckout: () => void;
  isRewardsMember: boolean;
  phoneNumber: string;
}

interface TaxData {
  success: boolean;
  message?: string;
}

const PaymentForm = ({ cancelCheckout, isRewardsMember }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState("");
  const [taxData, setTaxData] = useState<TaxData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTaxUpdated, setIsTaxUpdated] = useState(false);
  const { handleAddPoints } = useRewards();
  const { showAlert } = useAlert();
  const {
    clearCart,
    hasBeverages,
    updateFinaltotal,
    updateTax,
    subtotal,
    discount,
    tax,
    finaltotal,
    setExternalTax,
  } = useShoppingCart();

  useEffect(() => {
    if (taxData && taxData.success) {
      setExternalTax(true);
      updateTax(100);
      setIsTaxUpdated(true);
    }
  }, [taxData]);

  useEffect(() => {
    console.log("Updated tax: " + tax);
    console.log("Updated final total: " + (subtotal - discount + tax));
    updateFinaltotal(subtotal - discount + tax);
  }, [tax]); // tax as a dependency

  useEffect(() => {
    if (!isSubmitting || !isTaxUpdated) {
      return;
    }
    const submitPayment = async () => {
      console.log("submitting payment...");

      if (!stripe || !elements) {
        console.error("Stripe has not initialized yet.");
        return;
      }

      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        showAlert("No card number found!", "error");
        return;
      }
      setExternalTax(true);
      const updatedTax = 100; /*
          this is set for testing purposes to make sure that the tax can be updated, should be changed later to the actual taxData from Stripe as currently, Stripe does not calculate tax during development, value of taxability_reason: 'product_exempt'
      */
      updateTax(updatedTax);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
      });

      if (!error) {
        try {
          console.log("Tax:" + tax);
          const finalAmount = Math.round(
            Number((subtotal - discount + tax).toFixed(2)) * 100
          );
          const response = await fetch(config.baseApiUrl + "/payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: finalAmount,
              id: paymentMethod.id,
            }),
          });
        } catch (error) {
          console.error("Error during fetch operation: ", error);
        }
      }
      setIsSubmitting(false);
    };

    submitPayment();
    setIsTaxUpdated(false);
  }, [isSubmitting, isTaxUpdated]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (zipCode.length < 5) {
      showAlert("Please enter a zip code", "error");
      return;
    }

    try {
      const taxResponse = await fetch(config.baseApiUrl + "/calculate-tax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(Number(subtotal.toFixed(2)) * 100),
          zipCode: zipCode,
        }),
      });

      setTaxData(await taxResponse.json());
      setIsSubmitting(true);
    } catch (backendError: any) {
      console.error("Error: ", backendError.response, backendError.message);
    }

    //update the points on the rewardsMember
    if (isRewardsMember && hasBeverages) {
      handleAddPoints(Math.round(finaltotal / 100));
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
        </div>
        {/* ZIP */}
        <div className="mb-4 relative">
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
            onChange={(e) => setZipCode(e.target.value)}
          />
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
