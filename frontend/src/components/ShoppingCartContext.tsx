// REQUIRED FOR USING HMR WITH REACT CONTEXT
// SEE https://github.com/vitejs/vite/issues/3301#issuecomment-1080030773
// FOR MORE INFORMATION

import { createContext } from "react";

export type ProcessedCartItem = {
  itemQuantity: string;
  itemName: string;
  itemPrice: string;
  options: {
    name: string;
    quantity?: number;
    price?: string;
  }[];
};

type ShoppingCartContext = {
  addToCart: (
    item: MenuItem,
    option: Item[],
    specialInstructions: string,
    quantity: number,
    spice?: Item,
  ) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  updateDiscount: (newDiscount: number) => void;
  updateTax: (newTax: number) => void;
  updateSubtotal: (newSubtotal: number) => void;
  updateFinaltotal: (newFinaltotal: number) => void;
  setExternalTax: (setExternalTax: boolean) => void;
  cartQuantity: number;
  cartItems: CartItem[];
  isOpen: boolean;
  discount: number;
  hasBeverages: boolean;
  tax: number;
  subtotal: number;
  finaltotal: number;
  totalBeverageAmount: number;
  isExternalTaxSet: boolean;
  isEmpty: boolean;
  cartToString: (cartItems: CartItem[]) => ProcessedCartItem[];
};

export const ShoppingCartContext = createContext({} as ShoppingCartContext);
