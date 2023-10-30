import { ReactNode, useContext, useEffect, useState } from "react";
import { ShoppingCartContext } from "./ShoppingCartContext";
import useRewards from "../components/RewardsContext";
import SlideOver from "./SlideOver";

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

  useEffect(() => {
    const ls = localStorage.getItem("cartItems");

    const items = ls !== null ? JSON.parse(ls) : [];

    setCartItems(items);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [hasBeverages, setHasBeverages] = useState(false);
  const [totalBeverageAmount, setTotalBeverageAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [finaltotal, setFinalTotal] = useState(0);
  const [isExternalTaxSet, setExternalTax] = useState(false);

  const { handleRevertPendingPoints } = useRewards();

  const cartQuantity = cartItems.length;

  function updateDiscount(newDiscount: number) {
    setDiscount(newDiscount);
  }

  function updateSubtotal(newSubtotal: number) {
    setSubtotal(newSubtotal);
  }

  function updateFinaltotal(newFinaltotal: number) {
    setFinalTotal(Number(newFinaltotal.toFixed(2)));
  }

  function updateTax(newTax: number) {
    setTax(newTax);
  }

  function addToCart(
    item: MenuItem,
    option: Item[],
    specialInstructions: string,
    quantity: number,
    spice?: Item
  ) {
    if (spice !== null) {
      const newCartItems: CartItem[] = [
        ...cartItems,
        { item, option, spice, specialInstructions, quantity },
      ];
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    } else {
      const newCartItems: CartItem[] = [
        ...cartItems,
        { item, option, specialInstructions, quantity },
      ];
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    }
    setIsEmpty(false);
    if (item.menuType == "beverage") {
      setTotalBeverageAmount(
        (totalBeverageAmount) => totalBeverageAmount + Number(item.price)
      );
    }
    if (totalBeverageAmount > 0) {
      setHasBeverages(true);
    }
  }

  function removeItem(item: MenuItem) {
    const newCartItems: CartItem[] = cartItems.filter((x) => x.item !== item);
    setCartItems(newCartItems);
    if (newCartItems.length === 0) {
      setIsEmpty(true);
    }
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  }

  function clearCart() {
    const newCartItems: CartItem[] = [];
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    setTotalBeverageAmount(0);
    setIsEmpty(true);
  }

  function openCart() {
    setIsOpen(true);
    if (cartItems.length > 0) {
      setIsEmpty(false);
    }
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
        updateDiscount,
        addToCart,
        removeItem,
        clearCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
        isOpen,
        discount,
        hasBeverages,
        updateTax,
        updateSubtotal,
        updateFinaltotal,
        setExternalTax,
        tax,
        subtotal,
        finaltotal,
        totalBeverageAmount,
        isExternalTaxSet,
        isEmpty,
      }}
    >
      {children}
      <SlideOver />
    </ShoppingCartContext.Provider>
  );
}
