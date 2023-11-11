import React, { createContext } from "react";

export type RewardsType = "drinks" | "popcorn-chicken";

type RewardsContext = {
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  spentPoints: number;
  setSpentPoints: React.Dispatch<React.SetStateAction<number>>;
  beverageDiscount: number;
  itemLoading: boolean;
  drinkLoading: boolean;
  handleAddPoints: (addPoints: number) => Promise<void>;
  handleRevertPendingPoints: () => Promise<boolean>;
  setContextPhoneNumber: (phoneNumber: string) => void;
  setContextPoints: (points: number) => void;
  applyDiscountForItem: (
    itemType: RewardsType,
    cartItems: CartItem[],
    discount: number,
    totalBeverageAmount: number,
  ) => Promise<number>;
  setBeverageDiscount: React.Dispatch<React.SetStateAction<number>>;
  setDrinkLoading: (drinkLoading: boolean) => void;
  setItemLoading: (itemLoading: boolean) => void;
  setLoading: (loading1: boolean, loading2: boolean) => void;
  checkForBeverages: (cartItems: CartItem[]) => boolean;
};

export const RewardsContext = createContext({} as RewardsContext);
