import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  StripeCardNumberElementOptions,
  StripeCardElementOptions,
} from "@stripe/stripe-js";
import { config } from "../../config";
import { Printer } from "../Printer";
import useRewards from "../RewardsContext";
import { useShoppingCart } from "../ShoppingCartProvider";

const STRIPE_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: "14px",
      lineHeight: "20px",
    },
    invalid: {
      iconColor: "#df1b41",
    },
  },
};

const CARD_NUMBER_OPTIONS: StripeCardNumberElementOptions = {
  iconStyle: "solid",
  style: {
    base: {
      fontSize: "14px",
      lineHeight: "20px",
    },
    invalid: {
      iconColor: "#df1b41",
    },
  },
  showIcon: true,
};

interface PaymentFormProps {
  cancelCheckout: () => void;
  isRewardsMember: boolean;
  phoneNumber: string;
  setHandleSubmit: (func: any) => void;
  setLoading: (loading: boolean) => void;
}

type ValidationErrorType = "zip" | "name" | "card" | "cvc" | "expiry";

const PaymentForm = ({
  isRewardsMember,
  setHandleSubmit,
  setLoading,
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState("");
  const [name, setName] = useState("");
  const [cardError, setCardError] = useState(false);
  const [cvcError, setCvcError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [expiryError, setExpiryError] = useState(false);
  const [zipError, setZipError] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isExpiryComplete, setIsExpiryComplete] = useState(false);
  const [isCvcComplete, setIsCvcComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleAddPoints } = useRewards();
  const {
    clearCart,
    closeCart,
    hasBeverages,
    subtotal,
    discount,
    tax,
    finaltotal,
  } = useShoppingCart();

  const validations: { condition: boolean; type: ValidationErrorType }[] = [
    {
      condition: zipCode.length < 5,
      type: "zip",
    },
    {
      condition: name.length === 0,
      type: "name",
    },
    {
      condition: !isCardComplete,
      type: "card",
    },
    {
      condition: !isExpiryComplete,
      type: "expiry",
    },
    { condition: !isCvcComplete, type: "cvc" },
  ];

  const errorSetters: Record<
    ValidationErrorType,
    React.Dispatch<React.SetStateAction<boolean>>
  > = {
    zip: setZipError,
    name: setNameError,
    card: setCardError,
    cvc: setCvcError,
    expiry: setExpiryError,
  };

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }
    const submitPayment = async () => {
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
          console.log("Tax:" + tax);
          const finalAmount = Math.round(
            Number((subtotal - discount + tax).toFixed(2)) * 100,
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

          const responseData = await response.json();
          closeCart();

          if (responseData.success) {
            Printer(); //if enabled during development, payments will go through but you will get a backend error:
            /*
          Error:  undefined Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
          /*
          1. You might have mismatching versions of React and the renderer (such as React DOM)
          2. You might be breaking the Rules of Hooks
          3. You might have more than one copy of React in the same app
          See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem. 
          */
            console.log("Successful payment");
            clearCart();
            navigate("/payment-result", {
              state: {
                success: responseData.success,
              },
            });
          } else {
            console.log("Failed payment");
            navigate("/payment-result", {
              state: {
                success: responseData.success,
              },
            });
          }
        } catch (error) {
          console.error("Error during fetch operation: ", error);
        }
      }
      setIsSubmitting(false);
      setLoading(false);
    };

    console.log("submitting...");
    submitPayment();
  }, [isSubmitting]);

  const handleSubmit = async () => {
    let formInvalid = false;
    for (const validation of validations) {
      if (validation.condition) {
        formInvalid = true;
        errorSetters[validation.type](true);
      }
    }

    if (formInvalid) {
      console.error("Form is invalid");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    //update the points on the rewardsMember
    if (isRewardsMember && hasBeverages) {
      handleAddPoints(Math.floor(finaltotal));
    }
  };
  setHandleSubmit(handleSubmit);

  return (
    <form onSubmit={handleSubmit} className="pb-8">
      <h2 className="text-lg font-medium">Payment details</h2>
      {/* Name */}
      <div className="relative mb-4 mt-2">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          placeholder="Name on card"
          className={`${
            nameError ? "border-red-500" : "border-gray-300"
          } mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm`}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.length > 0) {
              setNameError(false);
            }
          }}
        />
        {nameError && (
          <p className="text-sm text-red-500">Please enter a name!</p>
        )}
      </div>
      {/* Card Number */}
      <div className="relative mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Card Number
        </label>
        <CardNumberElement
          options={CARD_NUMBER_OPTIONS}
          className={`${
            cardError ? "border-red-500" : "border-gray-200"
          } mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm`}
          onChange={(e) => {
            setIsCardComplete(e.complete);
            if (e.complete) {
              setCardError(false);
            }
          }}
        />
        {cardError && (
          <p className="text-sm text-red-500"> Please enter a card number!</p>
        )}
        <span className="absolute right-10 top-1/2 -translate-y-1/2 transform"></span>
      </div>
      {/* Expiration Date, CVV*/}
      <div className="mb-4 flex w-full space-x-2">
        {/* Expiration Date */}
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700">
            Expiration Date
          </label>
          <CardExpiryElement
            options={STRIPE_OPTIONS}
            className={`${
              expiryError ? "border-red-500" : "border-gray-200"
            } mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm`}
            onChange={(e) => {
              setIsExpiryComplete(e.complete);
              if (e.complete) {
                setExpiryError(false);
              }
            }}
          />
          {expiryError && (
            <p className="text-sm text-red-500">
              Please enter an expiration date!
            </p>
          )}
        </div>
        {/* CVV */}
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 ">
            CVC
          </label>
          <CardCvcElement
            options={STRIPE_OPTIONS}
            className={`${
              cvcError ? "border-red-500" : "border-gray-200"
            } mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm`}
            onChange={(e) => {
              setIsCvcComplete(e.complete);
              if (e.complete) {
                setCvcError(false);
              }
            }}
          />
          {cvcError && (
            <p className="text-sm text-red-500">Please enter the CVC!</p>
          )}
        </div>
      </div>
      {/* ZIP */}
      <div className="relative mb-4">
        <label className="block text-sm font-medium text-gray-700">Zip</label>
        <input
          type="text"
          className={`${
            zipError ? "border-red-500" : "border-gray-200"
          } font-base mt-1 block w-full rounded-md border px-3 py-2 text-sm`}
          placeholder="ZIP"
          pattern="\d{5}"
          maxLength={5}
          inputMode="numeric"
          onChange={(e) => {
            setZipCode(e.target.value);
            if (e.target.value.length == 5) {
              setZipError(false);
            }
          }}
        />
        {zipError && (
          <p className="text-sm text-red-500">Please enter a zip code!</p>
        )}
      </div>
    </form>
  );
};

export default PaymentForm;
