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
  const { cartItems, updateDiscount, discount, totalBeverageAmount } =
    useShoppingCart();
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
  const [spendingPoints, setSpendingPoints] = useState(10); //default spend points is 10
  const [loading, setLoading] = useState(false);
  let [phoneNumber, setPhoneNumber] = useState("");

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
    for (const item of cartItems) {
      if (item.item.menuType == "beverage") {
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
  };

  const handlePhoneChange = (e: { target: { value: string } }) => {
    if (e.target.value.replace(/\D/g, "").length <= 10) {
      setPhoneNumber(formatPhoneNumber(e.target.value));
      setContextPhoneNumber(cleanPhoneNumber(e.target.value));
    }
  };

  const handleAddPointsClick = () => {
    handleAddPoints(totalBeverageAmount);
  };

  async function handleSpendPoints(spendPoint: number) {
    if (subtotal === discount) {
      showAlert("You are already getting the drinks for free!", "error");
      return;
    }

    console.log(totalBeverageAmount);
    console.log(discount);
    if (totalBeverageAmount != 0) {
      if (totalBeverageAmount === discount) {
        showAlert("You are already getting the drinks for free!", "error");
        return;
      }
    }

    if (points === 0) {
      showAlert("Not enough points!", "error");
      return;
    }

    if (!checkForBeverages()) {
      showAlert("No beverages in cart!", "error");
      return;
    }

    phoneNumber = cleanPhoneNumber(phoneNumber);
    setLoading(true);
    try {
      let response = await fetch(
        config.baseApiUrl + "/rewards-member-pend-spend",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber, spendingPoints }),
        }
      );

      const data = await response.json();

      if (data) {
        if (data.points !== undefined && data.pendingPoints !== undefined) {
          const potentialDiscount = data.pendingPoints * 0.1; //each point is 10 cents off
          setPoints(data.points);
          setSpentPoints(data.pendingPoints);

          console.log(
            `Points left: ${data.points}, Pending points: ${data.pendingPoints}`
          );

          console.log("Potential discount: " + potentialDiscount);
          console.log("Total beverage amount: " + totalBeverageAmount);

          if (potentialDiscount >= totalBeverageAmount) {
            console.log("updating with total beverage amount!!");

            updateDiscount(totalBeverageAmount);
          } else {
            console.log("updating potential discount!!");
            updateDiscount(potentialDiscount);
          }
        } else {
          console.error(
            "Response did not contain points or pendingPoints information."
          );
          return;
        }
      } else {
        console.error("No data received from the server!");
        return;
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(`Failed to pend points for spending: ${errorMessage}`);
    }
    setLoading(false);
  }

  const handleSubmit = async () => {
    if (!phoneNumber) {
      showAlert("Phone number is empty or undefined", "error");
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
        console.log(`current points: ${data.points}`);

        if (!response.ok) {
          throw new Error("Failed to increment points");
        }
      } else {
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
        console.log("New member created!");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="border border-gray-300 p-4 rounded-md">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Sign up for our rewards system, or if you already have your phone with
        us, input your phone number to gain points on your order!
      </label>
      <input
        type="text"
        className="p-2 border border-gray-200 rounded w-full"
        placeholder="(111) 111-1111"
        value={phoneNumber}
        onChange={handlePhoneChange}
      />
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-lime-700 text-white font-semibold rounded hover:scale-110 transition lg:block"
      >
        Submit
      </button>

      {isShowingRewardsInfo && (
        <div className="mt-4">
          Points: {points}
          <div>
            Spend points! Discount only applies to beverages!
            <div className="flex mt-4 space-x-2">
              <button
                onClick={() => handleSpendPoints(10)}
                disabled={loading}
                className="mt-2 px-4 py-2 bg-lime-700 text-white font-semibold rounded hover:scale-110 transition lg:block"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white mx-auto"
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
                  "Spend 10 Points"
                )}
              </button>
              <button
                onClick={cancelShowingRewardsInfo}
                className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:scale-110 transition lg:block"
              >
                Cancel
              </button>
            </div>
            <button
              onClick={handleAddPointsClick}
              className="mt-2 px-4 py-2 bg-lime-700 text-white font-semibold rounded hover:scale-110 transition lg:block"
            >
              Add points THIS IS A TESTING BUTTON DELETE LATER!!!!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsSystem;
