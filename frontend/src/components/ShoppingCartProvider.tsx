import { ReactNode, useContext, useEffect, useState } from "react";
import { ShoppingCartContext } from "./ShoppingCartContext";
import { useRewards } from "../components/RewardsProvider";
import SlideOver from "./SlideOver";

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

  useEffect(() => {
    let calculatedBeverageAmount = 0;
    for (const item of cartItems) {
      if (item.item.menuType === "beverage") {
        calculatedBeverageAmount +=
          Number(item.item.price) * Number(item.quantity);
      }
    }

    setTotalBeverageAmount(calculatedBeverageAmount);

    if (calculatedBeverageAmount > 0) {
      setHasBeverages(true);
    } else {
      setHasBeverages(false);
    }
  }, [cartItems]);

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
    spice?: Item,
  ) {
    const id = Math.random().toString(36).substring(2, 18);

    if (spice !== null) {
      const newCartItems: CartItem[] = [
        ...cartItems,
        { id, item, option, spice, specialInstructions, quantity },
      ];
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    } else {
      const newCartItems: CartItem[] = [
        ...cartItems,
        { id, item, option, specialInstructions, quantity },
      ];
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    }
    setIsEmpty(false);
  }

  function updateItem(
    id: string,
    item: MenuItem,
    option: Item[],
    specialInstructions: string,
    quantity: number,
    spice?: Item,
  ) {
    const newItem = cartItems.findIndex((element) => id === element.id);

    if (item.menuType === "food") {
      cartItems[newItem] = {
        id,
        item,
        option,
        spice,
        specialInstructions,
        quantity,
      };
    } else {
      cartItems[newItem] = { id, item, option, specialInstructions, quantity };
    }

    setCartItems(cartItems);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  function removeItem(id: string) {
    const newCartItems: CartItem[] = cartItems.filter((x) => x.id !== id);
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
        updateItem,
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
