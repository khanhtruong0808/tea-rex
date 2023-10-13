// REQUIRED FOR USING HMR WITH REACT CONTEXT
// SEE https://github.com/vitejs/vite/issues/3301#issuecomment-1080030773
// FOR MORE INFORMATION

import { createContext } from "react";

interface Item {
  id?: number;
  name: string;
  price?: number;
  qty: number;
}

type ShoppingCartContext = {
  addToCart: (
    item: MenuItem,
    option: Item[],
    specialInstructions: string,
    quantity: number,
    spice?: Item
  ) => void;
  removeItem: (item: MenuItem) => void;
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
};

export const ShoppingCartContext = createContext({} as ShoppingCartContext);
