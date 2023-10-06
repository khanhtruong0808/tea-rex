import { ReactNode, useContext, useState } from "react";
import Cart from "../pages/Cart";
import { ShoppingCartContext } from "./ShoppingCartContext";

interface Item {
  id?: number;
  name: string;
  price?: number;
  qty: number;
}

type ShoppingCartProviderProps = {
  children: ReactNode;
};

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const cartQuantity = cartItems.length;

  function addToCart(
    item: MenuItem,
    option: Item[],
    spice: Item,
    specialInstructions: string,
    quantity: number
  ) {
    const newCartItems: CartItem[] = [
      ...cartItems,
      { item, option, spice, specialInstructions, quantity },
    ];
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  }

  function clearCart() {
    const newCartItems: CartItem[] = [];
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  }

  function openCart() {
    setIsOpen(true);
  }

  function closeCart() {
    setIsOpen(false);
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        addToCart,
        clearCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
        isOpen,
      }}
    >
      {children}
      <Cart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
