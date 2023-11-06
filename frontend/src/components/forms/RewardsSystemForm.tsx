import React, { useState, useEffect } from "react";
import { config } from "../../config";
import { useShoppingCart } from "../ShoppingCartProvider";
import useAlert from "../AlertMessageContext";
import useRewards from "../RewardsContext";
import { Spinner } from "../../utils/Spinner";

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
  setIsRewardsMember,
  setRewardsMemberPhoneNumber,
}: RewardsSystemProps) => {
  const { cartItems, updateDiscount, discount, totalBeverageAmount } =
    useShoppingCart();
  const {
    setContextPhoneNumber,
    handleRevertPendingPoints,
    setPoints,
    setSpentPoints,
    spentPoints,
    points,
  } = useRewards();
  const { showAlert } = useAlert();

  const [isShowingRewardsInfo, setIsShowingRewardsInfo] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [itemLoading, setItemLoading] = useState(false); // loading state for redeeming popcorn chicken
  //MDC: changed the name to be some generic item, in case the client wants to add new discount to different items
  const [drinkLoading, setDrinkLoading] = useState(false); // loading state for redeeming drinks
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [beverageDiscount, setBeverageDiscount] = useState(0);
  // eslint-disable-next-line prefer-const
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
    const cleaned = ("" + input).replace(/\D/g, "");
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

    rewardsType === "drinks" ? setDrinkLoading(true) : setItemLoading(true);

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
            case "drinks": {
              if (!checkForBeverages()) {
                showAlert("No beverages in cart!", "error");
                setDrinkLoading(false);
                return;
              }

              let potentialBeverageDiscount = Math.min(
                totalBeverageAmount - beverageDiscount,
                6,
              );

              if (potentialBeverageDiscount < 0) potentialBeverageDiscount = 0;

              if (potentialBeverageDiscount === 0) {
                showAlert("No more beverages to apply discount!", "error");
                setDrinkLoading(false);
                setItemLoading(false);
                return;
              }

              setBeverageDiscount(
                (beverageDiscount) =>
                  beverageDiscount + potentialBeverageDiscount,
              );
              updateDiscount(discount + potentialBeverageDiscount);
              break;
            }

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
          setDrinkLoading(false);
          setItemLoading(false);
          return;
        }
      } else {
        console.error("No data received from the server!");
        setDrinkLoading(false);
        setItemLoading(false);
        return;
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      showAlert(errorMessage, "error");
    }
    setDrinkLoading(false);
    setItemLoading(false);
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
      setItemLoading(false);
      return;
    }

    const finalDiscount = Number(discount) + Number(itemPrice);

    const adjustedDiscount = parseFloat(
      (Number(finalDiscount) - Number(beverageDiscount)).toFixed(2),
    );
    const adjustedTotalItemCost = parseFloat(totalItemCost.toFixed(2));

    if (adjustedDiscount > adjustedTotalItemCost) {
      showAlert(
        `No more ${config.itemName} to redeem or discount exceeds available amount!`,
        "error",
      );
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

    setPhoneLoading(true);
    try {
      let response = await fetch(config.baseApiUrl + "/rewards-member-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

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
    setPhoneLoading(false);
  };

  return (
    <div>
      <h2 className="text-lg font-medium">Rewards</h2>
      <p className="my-2 block text-sm text-gray-800">
        Sign up for our rewards system, or if you already have your phone with
        us, input your phone number to gain points on your order!
      </p>
      <label className="my-2 border-gray-300 pt-2 text-sm font-medium text-gray-700">
        Phone number
      </label>
      <div className="flex items-end gap-2">
        <input
          type="text"
          className={`${
            phoneError ? "border-red-500" : "border-gray-200"
          } mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm`}
          placeholder="(111) 111-1111"
          value={phoneNumber}
          onChange={handlePhoneChange}
        />
        <button
          onClick={handleSubmit}
          className="w-20 rounded-md border bg-lime-600 px-3 py-2 text-sm text-white hover:bg-lime-700 lg:block"
        >
          {phoneLoading ? <Spinner /> : "Submit"}
        </button>
      </div>
      {phoneError && (
        <p className="text-sm text-red-500">
          Please enter a valid phone number!
        </p>
      )}

      {isShowingRewardsInfo && (
        <div className="mt-4">
          <div className="mb-4 flex flex-col">
            <button
              onClick={() => {
                handleSpendPoints(50, "drinks");
              }}
              disabled={drinkLoading || points < 50}
              className="group mt-2 h-12 w-full rounded bg-lime-600 text-sm text-white enabled:hover:bg-lime-700 lg:block"
            >
              {drinkLoading ? (
                <Spinner />
              ) : (
                <div className="flex group-disabled:cursor-not-allowed group-disabled:opacity-50">
                  <div className="flex items-center justify-center whitespace-nowrap border-r border-lime-900 px-5 text-base">
                    50 points
                  </div>
                  <div className="flex w-full flex-col items-center justify-center px-4">
                    <p>Up to $6 off any drink*</p>
                  </div>
                </div>
              )}
            </button>
            <button
              onClick={() => {
                handleSpendPoints(200, "popcorn-chicken");
              }}
              disabled={itemLoading || points < 200}
              className="group mt-2 h-12 w-full rounded bg-lime-600 text-sm text-white enabled:hover:bg-lime-700 lg:block"
            >
              {itemLoading ? (
                <Spinner />
              ) : (
                <div className="flex group-disabled:cursor-not-allowed group-disabled:opacity-50">
                  <div className="flex items-center justify-center whitespace-nowrap border-r border-lime-900 px-4 text-base">
                    200 points
                  </div>
                  <div className="flex w-full flex-col items-center justify-center px-4">
                    <p>Free popcorn chicken</p>
                  </div>
                </div>
              )}
            </button>
          </div>
          <span className="font-medium">{points}</span> points left
          <p className="text-xs text-gray-700">
            *Redeeming $6 off a drink does not include price of toppings
          </p>
          <button
            onClick={cancelShowingRewardsInfo}
            className="mt-2 rounded border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 lg:block"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default RewardsSystem;
