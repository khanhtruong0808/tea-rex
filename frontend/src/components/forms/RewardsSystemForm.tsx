import React, { useState, useEffect } from "react";
import { config } from "../../config";
import { useShoppingCart } from "../ShoppingCartProvider";
import useAlert from "../AlertMessageContext";
import { useRewards } from "../RewardsProvider";
import { RewardsType } from "../RewardsContext";
import { Spinner } from "../../utils/Spinner";

/*  
	NOTES: ---------------------------------------------------------------
	test phone numbers:   44444444444444444
                      	444444444
	phoneNumber = cleanPhoneNumber(phoneNumber); must be added before grabbing a phone number from the database. 
	Phone numbers are stored as 4444444444, not (444) 444-4444
	-----------------------------------------------------------------------
*/

interface RewardsSystemProps {
  subtotal: number;
}

const RewardsSystemForm = ({ subtotal }: RewardsSystemProps) => {
  const { cartItems, updateDiscount, discount, totalBeverageAmount } =
    useShoppingCart();
  const {
    points,
    drinkLoading,
    itemLoading,
    handleRevertPendingPoints,
    applyDiscountForItem,
    setPoints,
    setSpentPoints,
    spentPoints,
    setDrinkLoading,
    setItemLoading,
    setLoading,
    checkForItem,
    setRewardsMemberPhoneNumber,
    setContextPhoneNumber,
    isRewardsMember,
    setIsRewardsMember,
  } = useRewards();
  const { showAlert } = useAlert();

  const [isShowingRewardsInfo, setIsShowingRewardsInfo] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  // eslint-disable-next-line prefer-const
  let [phoneNumber, setPhoneNumber] = useState("");

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

  //This function only triggers when the user does a reload or exits the window, not when the user clicks on a new tab on the website.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (spentPoints > 0 && isRewardsMember) {
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
    if (isRewardsMember) {
      handleRevertPendingPoints();
    }
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
    subtotal: number,
    discount: number,
    phoneNumber: string,
    points: number,
    totalBeverageAmount: number,
    rewardsType: RewardsType,
  ) {
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
              if (!checkForItem(cartItems, "beverage")) {
                showAlert("No drinks in cart!", "error");
                setDrinkLoading(false);
                return;
              }

              if (totalBeverageAmount === discount) {
                showAlert(
                  "You are already getting the drinks for free!",
                  "error",
                );
                setDrinkLoading(false);
                return;
              }
              const discountApplied = await applyDiscountForItem(
                rewardsType,
                cartItems,
                discount,
                totalBeverageAmount,
              );
              if (discountApplied === 0) {
                showAlert("No more beverages to apply discount!", "error");
                return;
              }
              updateDiscount(discountApplied);
              break;
            }

            case "popcorn-chicken":
              if (!checkForItem(cartItems, rewardsType)) {
                showAlert("No popcorn chicken in cart!", "error");
                setItemLoading(false);
                return;
              }
              if (subtotal === discount) {
                showAlert(
                  `You already are getting ${rewardsType} for free!`,
                  "error",
                );
                setItemLoading(false);
                return;
              }
              const discountApplied = await applyDiscountForItem(
                rewardsType,
                cartItems,
                discount,
                totalBeverageAmount,
              );

              switch (discountApplied) {
                case -1:
                  showAlert(
                    `No more popcorn chicken to redeem or discount exceeds available amount!`,
                    "error",
                  );
                  return;
                case -2:
                  showAlert(
                    "Please add popcorn chicken to your cart to redeem reward!",
                    "error",
                  );
                  return;
              }

              updateDiscount(discountApplied);
              break;
            // more discounts for different food items, not including drinks, can be added using applyDiscountForItem function
          }

          setPoints(data.points);
          setSpentPoints(data.pendingPoints);
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
          setLoading(false, false);

          return;
        }
      } else {
        console.error("No data received from the server!");
        setLoading(false, false);

        return;
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(errorMessage);
    }
    setLoading(false, false);
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
        if (isRewardsMember) {
          handleRevertPendingPoints();
        }
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
                handleSpendPoints(
                  50,
                  subtotal,
                  discount,
                  phoneNumber,
                  points,
                  totalBeverageAmount,
                  "drinks",
                );
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
                handleSpendPoints(
                  200,
                  subtotal,
                  discount,
                  phoneNumber,
                  points,
                  totalBeverageAmount,
                  "popcorn-chicken",
                );
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

export default RewardsSystemForm;
