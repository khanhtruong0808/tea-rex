import { ReactNode, useContext, useState } from "react";
import Cart from "../pages/Cart";
import { ShoppingCartContext } from "./ShoppingCartContext";
import useRewards from "../components/RewardsContext";

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
    if (item.menuType == "beverage") {
      setTotalBeverageAmount(
        (totalBeverageAmount) => totalBeverageAmount + Number(item.price)
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
      }}
    >
      {children}
      <Cart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}