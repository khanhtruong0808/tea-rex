import React, { useState, useEffect } from "react";
import { config } from "../../config";
import { useShoppingCart } from "../ShoppingCartProvider";
import useAlert from "../AlertMessageContext";
import useRewards from "../RewardsContext";

/*  
	NOTES: ---------------------------------------------------------------
	test phone numbers:   44444444444444444
                      	444444444
	phoneNumber = cleanPhoneNumber(phoneNumber); must be added before grabbing a phone number from the database. 
	Phone numbers are stored as 4444444444, not (444) 444-4444
	-----------------------------------------------------------------------
*/
type RewardsType = "drinks" | "popcorn-chicken";

interface RewardsSystemProps {
  subtotal: number;
  total: number;
  setIsRewardsMember: React.Dispatch<React.SetStateAction<boolean>>;
  setRewardsMemberPhoneNumber: (rewardsMemberPhoneNumber: string) => void;
}

const RewardsSystem = ({
  subtotal,
  total,
  setIsRewardsMember,
  setRewardsMemberPhoneNumber,
}: RewardsSystemProps) => {
  const {
    cartItems,
    updateDiscount,
    discount,
    totalBeverageAmount,
    addToCart,
  } = useShoppingCart();
  const {
    setContextPhoneNumber,
    handleAddPoints,
    handleRevertPendingPoints,
    setPoints,
    setSpentPoints,
    spentPoints,
    points,
  } = useRewards();
  let { showAlert } = useAlert();

  const [isShowingRewardsInfo, setIsShowingRewardsInfo] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [beverageDiscount, setBeverageDiscount] = useState(0);
  let [phoneNumber, setPhoneNumber] = useState("");

  const discountItems = {
    "popcorn-chicken": {
      itemName: "Popcorn Chicken",
      alertMessage: "Please add popcorn chicken to your cart to redeem reward!",
    },

    drinks: {
      itemName: "Drink",
      alertMessage: "Please add a drink to your cart to redeem reward!",
    },
  };

  const formatPhoneNumber = (input: string) => {
    let cleaned = ("" + input).replace(/\D/g, "");
    if (cleaned.length == 0) {
      return "";
    } else if (cleaned.length <= 3) {
      return "(" + cleaned;
    } else if (cleaned.length <= 6) {
      return "(" + cleaned.slice(0, 3) + ") " + cleaned.slice(3);
    } else {
      return (
        "(" +
        cleaned.slice(0, 3) +
        ") " +
        cleaned.slice(3, 6) +
        "-" +
        cleaned.slice(6, 10)
      );
    }
  };

  const cleanPhoneNumber = (input: string) => {
    return ("" + input).replace(/\D/g, "");
  };

  const checkForBeverages = () => {
    for (const cartItem of cartItems) {
      if (cartItem.item.menuType == "beverage") {
        return true;
      }
    }
    return false;
  };

  //This function only triggers when the user does a reload or exits the window, not when the user clicks on a new tab on the website.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (spentPoints > 0) {
        event.preventDefault();
        event.returnValue =
          "You have spent points, are you sure you want to leave?";
        handleRevertPendingPoints();
      } else {
        console.log("spentPoints: " + spentPoints);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [spentPoints]);

  const cancelShowingRewardsInfo = () => {
    setIsShowingRewardsInfo(false);
    handleRevertPendingPoints();
    updateDiscount(0);
  };

  const handlePhoneChange = (e: { target: { value: string } }) => {
    if (e.target.value.replace(/\D/g, "").length <= 10) {
      setPhoneNumber(formatPhoneNumber(e.target.value));
    }
    if (phoneNumber.length === 14) {
      setContextPhoneNumber(cleanPhoneNumber(phoneNumber));
      setPhoneError(false);
    }
  };

  async function handleSpendPoints(
    spentPoints: number,
    rewardsType: RewardsType,
  ) {
    if (subtotal === discount) {
      showAlert("You are already getting the drinks for free!", "error");
      return;
    }

    if (points === 0) {
      showAlert("Not enough points!", "error");
      return;
    }

    phoneNumber = cleanPhoneNumber(phoneNumber);
    setContextPhoneNumber(phoneNumber);

    setLoading(true);
    try {
      const response = await fetch(
        config.baseApiUrl + "/rewards-member-pend-spend",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber, spentPoints }),
        },
      );

      const data = await response.json();

      if (data) {
        if (data.points !== undefined && data.pendingPoints !== undefined) {
          const potentialDiscount = 0;

          switch (rewardsType) {
            case "drinks":
              if (!checkForBeverages()) {
                showAlert("No beverages in cart!", "error");
                setLoading(false);
                return;
              }

              let potentialBeverageDiscount = Math.min(
                totalBeverageAmount - beverageDiscount,
                6,
              );

              if (potentialBeverageDiscount < 0) potentialBeverageDiscount = 0;

              if (potentialBeverageDiscount === 0) {
                showAlert("No more beverages to apply discount!", "error");
                setLoading(false);
                return;
              }

              setBeverageDiscount(
                (beverageDiscount) =>
                  beverageDiscount + potentialBeverageDiscount,
              );
              updateDiscount(discount + potentialBeverageDiscount);
              break;

            case "popcorn-chicken":
              if (!applyDiscountForItem(rewardsType)) {
                return;
              }
              break;
            // more discounts for different food items, not including drinks, can be added using applyDiscountForItem function
          }

          setPoints(data.points);
          setSpentPoints(data.pendingPoints);

          console.log("Potential discount: " + potentialDiscount);
        } else {
          if (data.points == undefined) {
            console.error(
              "Response did not contain points information: " + data.points,
            );
          }
          if (data.pendingPoints == undefined) {
            console.error(
              "Response did not contain pending points information: " +
                data.pendingPoints,
            );
          }
          setLoading(false);
          return;
        }
      } else {
        console.error("No data received from the server!");
        setLoading(false);
        return;
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      showAlert(errorMessage, "error");
    }
    setLoading(false);
  }

  function applyDiscountForItem(itemType: RewardsType) {
    let foundItem = false;
    let itemPrice = 0;
    let totalItemCost = 0;
    const config = discountItems[itemType];

    if (!config) {
      console.error("Unknown item type");
    }

    for (const cartItem of cartItems) {
      if (cartItem.item.name == config.itemName) {
        totalItemCost += Number(cartItem.item.price);
        foundItem = true;
        if (itemPrice == 0) {
          itemPrice = Number(cartItem.item.price);
        }
      }
    }

    if (!foundItem) {
      showAlert(config.alertMessage, "error");
      setLoading(false);
      return;
    }

    let finalDiscount = Number(discount) + Number(itemPrice);

    const adjustedDiscount = parseFloat(
      (Number(finalDiscount) - Number(beverageDiscount)).toFixed(2),
    );
    const adjustedTotalItemCost = parseFloat(totalItemCost.toFixed(2));

    if (adjustedDiscount > adjustedTotalItemCost) {
      showAlert(
        `No more ${config.itemName} to redeem or discount exceeds available amount!`,
        "error",
      );
      setLoading(false);
      return false;
    }

    updateDiscount(finalDiscount);
    return true;
  }

  const handleSubmit = async () => {
    if (!phoneNumber) {
      setPhoneError(true);
      return;
    }
    if (phoneNumber.length < 14) {
      showAlert("Not enough numbers", "error");
      return;
    }

    phoneNumber = cleanPhoneNumber(phoneNumber);
    try {
      let response = await fetch(config.baseApiUrl + "/rewards-member-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      let data = await response.json();

      if (data && data.exists) {
        handleRevertPendingPoints();
        setPoints(data.points);
        setIsShowingRewardsInfo(true);
        setIsRewardsMember(true);
        setRewardsMemberPhoneNumber(data.phoneNumber);

        if (!response.ok) {
          throw new Error("Failed to increment points");
        }
      } else {
        // new member
        response = await fetch(config.baseApiUrl + "/rewards-member-add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber, points: 0 }),
        });

        if (!response.ok) {
          throw new Error("Failed to create new member");
        }
        setPoints(0);
        setIsShowingRewardsInfo(true);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="rounded-md border border-gray-300 p-4">
      <label className="mb-2 block text-sm font-medium text-gray-600">
        Sign up for our rewards system, or if you already have your phone with
        us, input your phone number to gain points on your order!
      </label>
      <input
        type="text"
        className={`p-2  ${
          phoneError ? "border-2 border-red-500" : "border border-gray-200"
        } w-full rounded`}
        placeholder="(111) 111-1111"
        value={phoneNumber}
        onChange={handlePhoneChange}
      />
      {phoneError && (
        <p className="text-sm text-red-500">
          Please enter a valid phone number!
        </p>
      )}
      <button
        onClick={handleSubmit}
        className="mt-2 rounded bg-lime-700 px-4 py-2 font-semibold text-white transition hover:scale-110 lg:block"
      >
        Submit
      </button>

      {isShowingRewardsInfo && (
        <div className="mt-4">
          Points: {points}
          <div>
            Spend points! Discount only applies to beverages!
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => {
                  handleSpendPoints(50, "drinks");
                }}
                disabled={loading}
                className="mt-2 rounded bg-lime-700 px-4 py-2 font-semibold text-white transition hover:scale-110 lg:block"
              >
                {loading ? (
                  <svg
                    className="mx-auto h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Spend 50 Points for a free drink under $6!"
                )}
              </button>

              <button
                onClick={() => {
                  handleSpendPoints(200, "popcorn-chicken");
                }}
                disabled={loading}
                className="mt-2 rounded bg-lime-700 px-4 py-2 font-semibold text-white transition hover:scale-110 lg:block"
              >
                {loading ? (
                  <svg
                    className="mx-auto h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Spend 200 Points for free popcorn chicken!"
                )}
              </button>
              <button
                onClick={cancelShowingRewardsInfo}
                className="mt-2 rounded bg-red-500 px-4 py-2 font-semibold text-white transition hover:scale-110 lg:block"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsSystem;
