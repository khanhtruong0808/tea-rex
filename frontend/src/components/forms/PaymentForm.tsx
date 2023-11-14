import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
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
import { useRewards } from "../RewardsProvider";
import { useShoppingCart } from "../ShoppingCartProvider";
import { ProcessedCartItem } from "../ShoppingCartContext";

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
  setHandleSubmit: (func: () => Promise<void>) => void;
  setLoading: (loading: boolean) => void;
}

interface OrderMessageProps {
  orderId: string;
  name: string;
  cartItems: ProcessedCartItem[];
  subtotal: string;
  tax: string;
  finalAmount: string;
}

type ValidationErrorType = "zip" | "name" | "card" | "cvc" | "expiry" | "email";

function isValidEmail(email: string) {
  const regex =
    /^(?!.*\.\.)(?!.*\.$)^[^\.][a-zA-Z0-9._-]+[^\.]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

const PaymentForm = ({ setHandleSubmit, setLoading }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState("");
  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [cardError, setCardError] = useState(false);
  const [cvcError, setCvcError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [expiryError, setExpiryError] = useState(false);
  const [zipError, setZipError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isExpiryComplete, setIsExpiryComplete] = useState(false);
  const [isCvcComplete, setIsCvcComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleAddPoints, isRewardsMember } = useRewards();
  const {
    clearCart,
    closeCart,
    hasBeverages,
    subtotal,
    discount,
    tax,
    finaltotal,
    cartToString,
    cartItems,
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
    { condition: !isValidEmail(userEmail), type: "email" },
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
    email: setEmailError,
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
          const finalAmount = Math.round(
            Number((subtotal - discount + tax).toFixed(2)) * 100,
          );
          const orderId = await Printer();

          const orderMessage = createOrderMessage({
            orderId: orderId.toString(),
            name: name,
            cartItems: cartToString(cartItems),
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            finalAmount: (finalAmount / 100).toFixed(2),
          });

          const emailContent = ReactDOMServer.renderToString(orderMessage);

          let response = await fetch(config.baseApiUrl + "/send-mail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "daphney.koss7@ethereal.email", // testing email, change to tea-rex email before final deployment
              to: userEmail,
              subject: "Tea-Rex Order",
              text: "",
              html: emailContent,
              attachments: [
                {
                  filename: "tea-rex.webp",
                  path: "../frontend/public/tea-rex-logos/tearex.webp",
                  cid: "tea-rexcid",
                },
              ],
            }),
          });

          const emailResponse = await response.json();

          if (emailResponse.success) {
            console.log("Email sent successfully!");
          } else {
            console.error("Failed to send email", emailResponse.message);
          }

          response = await fetch(config.baseApiUrl + "/payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              email: userEmail,
              amount: finalAmount,
              id: paymentMethod.id,
              orderId: orderId,
            }),
          });

          const responseData = await response.json();
          closeCart();

          if (responseData.success) {
            console.log("Successful payment");
            //clearCart();
            if (localStorage.getItem("fixedTime") !== null) {
              localStorage.removeItem("fixedTime");
            }

            navigate("/payment-result", {
              state: {
                success: responseData.success,
                orderId: orderId,
                name: name,
              },
            });
          } else {
            console.log(responseData.message);
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
        console.error("Invalid type: " + validation.type);
        errorSetters[validation.type](true);
      }
    }

    if (formInvalid) {
      console.error("Form is invalid");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    if (isRewardsMember && hasBeverages) {
      handleAddPoints(Math.floor(finaltotal));
    }
  };
  setHandleSubmit(handleSubmit);

  function createOrderMessage({
    orderId,
    name,
    cartItems,
    subtotal,
    tax,
    finalAmount,
  }: OrderMessageProps) {
    const printCartItems = () => {
      return cartItems.map((cartItem, index) => (
        <table
          key={index}
          style={{
            width: "100%",
            marginBottom: "20px",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ padding: "5px", border: "1px solid #ddd" }}
                colSpan={2}
              >
                {" "}
                <p style={{ fontWeight: "bold" }}>
                  {cartItem.itemQuantity}x {cartItem.itemName}
                </p>
              </td>
              <td
                style={{
                  padding: "5px",
                  border: "1px solid #ddd",
                  textAlign: "right",
                }}
              >
                {cartItem.itemPrice}
              </td>
            </tr>
            {cartItem.options.map((option, idx) => (
              <tr key={idx}>
                <td
                  style={{ padding: "5px", border: "1px solid #ddd" }}
                  colSpan={2}
                >
                  {option.name}
                </td>
                <td
                  style={{
                    padding: "5px",
                    border: "1px solid #ddd",
                    textAlign: "right",
                  }}
                >
                  {option.quantity && option.quantity !== -1 && undefined
                    ? `: ${option.quantity}`
                    : ""}
                  {option.price ? ` ${option.price}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ));
    };

    return (
      <html>
        <head></head>
        <body>
          <table cellPadding="0" cellSpacing="0" width="100%">
            <tr>
              <td style={{ textAlign: "left", verticalAlign: "top" }}>
                <h1>Tea-Rex order: {orderId}</h1>
                <h2>For: {name}</h2>
                <h5>2475 Elk Grove Blvd #150 Elk Grove, CA 95758</h5>
                <h5>Order date: {new Date().toLocaleDateString()}</h5>
              </td>
              <td style={{ textAlign: "right", verticalAlign: "top" }}>
                <img src="cid:tea-rexcid" width="200" />
              </td>
            </tr>
          </table>
          <p>{printCartItems()}</p>
          <table cellPadding="0" cellSpacing="0" width="100%">
            <tr>
              <td style={{ textAlign: "left", verticalAlign: "top" }}>
                <h5>Subtotal:</h5>
                <h5>Tax:</h5>
                <h5>Total Amount:</h5>
              </td>
              <td style={{ textAlign: "right", verticalAlign: "top" }}>
                <h5>${subtotal}</h5>
                <h5>${tax}</h5>
                <h5>${finalAmount}</h5>
              </td>
            </tr>
          </table>
        </body>
      </html>
    );
  }

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
      {/* Email */}
      <div className="relative mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="text"
          className={`${
            emailError ? "border-red-500" : "border-gray-200"
          } font-base mt-1 block w-full rounded-md border px-3 py-2 text-sm`}
          placeholder="Email Address"
          inputMode="numeric"
          onChange={(e) => {
            setUserEmail(e.target.value);
            if (e.target.value.length > 0) {
              setEmailError(false);
            }
          }}
        />
        {emailError && (
          <p className="text-sm text-red-500">Please enter a valid email!</p>
        )}
      </div>
    </form>
  );
};

export default PaymentForm;
