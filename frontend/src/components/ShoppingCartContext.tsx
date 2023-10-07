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
    spice: Item,
    specialInstructions: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  updateDiscount: (newDiscount: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
  isOpen: boolean;
  discount: number;
  hasBeverages: boolean;
};

export const ShoppingCartContext = createContext({} as ShoppingCartContext);
