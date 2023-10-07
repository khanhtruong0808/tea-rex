import { ReactNode, createContext, useContext, useState } from "react";
import Cart from "../pages/Cart";
import useRewards from "../components/RewardsContext";

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
  updateDiscount: (newDiscount: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
  isOpen: boolean;
  discount: number;
  hasBeverages: boolean;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [hasBeverages, setHasBeverages] = useState(false);
  const {
    handleRevertPendingPoints,
    setTotalBeverageAmount,
    totalBeverageAmount,
  } = useRewards();

  const cartQuantity = cartItems.length;

  function updateDiscount(newDiscount: number) {
    setDiscount(newDiscount);
  }

  function addToCart(item: MenuItem, option: Item[], spice: Item) {
    const newCartItems: CartItem[] = [...cartItems, { item, option, spice }];
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    if (item.menuType == "beverage") {
      setTotalBeverageAmount(
        (totalBeverageAmount) => totalBeverageAmount + item.price
      );
    }
    if (totalBeverageAmount > 0) {
      setHasBeverages(true);
    }
  }

  function clearCart() {
    const newCartItems: CartItem[] = [];
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    setTotalBeverageAmount(0);
  }

  function openCart() {
    setIsOpen(true);
    console.log(isOpen);
  }

  function closeCart() {
    setIsOpen(false);
    handleRevertPendingPoints()
      .then((isSuccessful) => {
        if (isSuccessful) {
          updateDiscount(0);
        }
      })
      .catch((error) => {
        console.error("Error during handleRevertPendingPoints", error);
      });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        addToCart,
        clearCart,
        openCart,
        closeCart,
        cartItems,
        updateDiscount,
        cartQuantity,
        isOpen,
        discount,
        hasBeverages,
      }}
    >
      {children}
      <Cart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
