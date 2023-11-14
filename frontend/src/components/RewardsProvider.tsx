import { ReactNode, useContext, useState } from "react";
import { config } from "../config";
import useAlert from "./AlertMessageContext";
import { RewardsContext, RewardsType } from "./RewardsContext";

type RewardsProviderProps = {
  children: ReactNode;
};

export function useRewards() {
  return useContext(RewardsContext);
}

const discountItems = {
  "popcorn-chicken": {
    itemName: "Popcorn Chicken",
    alertMessage: "Please add popcorn chicken to your cart to redeem reward!",
  },

  drinks: {
    itemName: "Almond Milk Tea", //for testing
    alertMessage: "Please add a drink to your cart to redeem reward!",
  },
};

export function RewardsProvider({ children }: RewardsProviderProps) {
  const [points, setPoints] = useState(0);
  const [spentPoints, setSpentPoints] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [beverageDiscount, setBeverageDiscount] = useState(0);
  const [itemLoading, setItemLoading] = useState(false); // loading state for redeeming some item
  const [drinkLoading, setDrinkLoading] = useState(false); // loading state for redeeming drinks
  const [isRewardsMember, setIsRewardsMember] = useState(false);
  const [rewardsMemberPhoneNumber, setRewardsMemberPhoneNumber] = useState("");
  const { showAlert } = useAlert();

  function setContextPhoneNumber(phoneNumber: string) {
    setPhoneNumber(phoneNumber);
  }

  function setContextPoints(points: number) {
    setPoints(points);
  }

  function setLoading(loading1: boolean = false, loading2: boolean = false) {
    setDrinkLoading(loading1);
    setItemLoading(loading2);
  }

  async function handleRevertPendingPoints(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!phoneNumber) {
        reject(new Error("Phone number is required"));
        return;
      }
      fetch(config.baseApiUrl + "/rewards-member-revert-pending", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.points) {
            setPoints(data.points);
            setSpentPoints(0);
            setBeverageDiscount(0);
            setPhoneNumber("");
            resolve(true);
            return;
          } else {
            console.error(data.error);
            resolve(false);
            return;
          }
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.error(
            `Error while reverting pending points: ${errorMessage}`,
          );
          reject(false);
          return;
        });
    });
  }

  async function handleAddPoints(subtotal: number) {
    const addPoints = Math.round(subtotal);
    const newPoints = points + addPoints;
    try {
      const response = await fetch(
        config.baseApiUrl + "/rewards-member-update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber, newPoints }),
        },
      );

      const data = await response.json();

      if (data) {
        setPoints(data.points);
        setSpentPoints(0);
      } else {
        console.error("No data!");
        return;
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(errorMessage);
    }
  }

  const checkForItem = (cartItems: CartItem[], type: string) => {
    for (const cartItem of cartItems) {
      if (type == "popcorn-chicken") {
        if (cartItem.item.name == discountItems[type].itemName) {
          return true;
        }
      } else {
        if (cartItem.item.menuType == type.toString()) {
          return true;
        }
      }
    }
    return false;
  };

  function applyDiscountForItem(
    itemType: RewardsType,
    cartItems: CartItem[],
    discount: number,
    totalBeverageAmount: number,
  ): Promise<number> {
    const config = discountItems[itemType];
    return new Promise(async (resolve) => {
      if (!config) {
        console.error("Unknown item type");
        resolve(-1);
        return;
      }

      switch (itemType) {
        case "drinks": {
          let potentialBeverageDiscount = Math.min(
            totalBeverageAmount - beverageDiscount,
            6,
          );

          if (potentialBeverageDiscount < 0) {
            potentialBeverageDiscount = 0;
          }

          if (potentialBeverageDiscount === 0) {
            setLoading(false, false);
            resolve(potentialBeverageDiscount);
          }

          setBeverageDiscount(
            (beverageDiscount) => beverageDiscount + potentialBeverageDiscount,
          );
          resolve(discount + potentialBeverageDiscount);
        }

        case "popcorn-chicken": {
          let foundItem = false;
          let itemPrice = 0;
          let totalItemCost = 0;

          for (const cartItem of cartItems) {
            if (cartItem.item.name == config.itemName) {
              totalItemCost +=
                Number(cartItem.item.price) * Number(cartItem.quantity);
              foundItem = true;
              if (itemPrice == 0) {
                itemPrice = Number(cartItem.item.price);
              }
            }
          }

          if (!foundItem) {
            setItemLoading(false);
            resolve(-2);
            return;
          }

          const finalDiscount = Number(discount) + Number(itemPrice);

          const adjustedDiscount = parseFloat(
            (Number(finalDiscount) - Number(beverageDiscount)).toFixed(2),
          );
          const adjustedTotalItemCost = parseFloat(totalItemCost.toFixed(2));

          if (adjustedDiscount > adjustedTotalItemCost) {
            setItemLoading(false);
            resolve(-1);
            return;
          }
          setItemLoading(false);
          resolve(finalDiscount);
          return;
        }
      }
    });
  }

  return (
    <RewardsContext.Provider
      value={{
        points,
        setPoints,
        spentPoints,
        itemLoading,
        drinkLoading,
        isRewardsMember,
        rewardsMemberPhoneNumber,
        setSpentPoints,
        handleAddPoints,
        handleRevertPendingPoints,
        setContextPhoneNumber,
        setContextPoints,
        applyDiscountForItem,
        beverageDiscount,
        setBeverageDiscount,
        setItemLoading,
        setDrinkLoading,
        setLoading,
        checkForItem,
        setIsRewardsMember,
        setRewardsMemberPhoneNumber,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}
