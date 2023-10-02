import { ReactNode, createContext, useContext, useState } from "react";
import Cart from "../pages/Cart";

interface Item {
  id?: number;
  name: string;
  price?: number;
  qty: number;
}

type CartItem = {
  item: MenuItem;
  option: Item[];
  spice: Item;
};

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type ShoppingCartContext = {
  addToCart: (item: MenuItem, option: Item[], spice: Item) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  cartQuantity: number;
  cartItems: CartItem[];
  isOpen: boolean;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const cartQuantity = cartItems.length;

  function addToCart(item: MenuItem, option: Item[], spice: Item) {
    const newCartItems: CartItem[] = [...cartItems, { item, option, spice }];
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
    console.log(isOpen);
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
