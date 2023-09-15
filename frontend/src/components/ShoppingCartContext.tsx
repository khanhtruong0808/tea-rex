import { ReactNode, createContext, useContext, useState } from "react";

interface Item {
    id?: number
    name: string;
    price?: number;
    qty: number;
}

type CartItem = {
    item: MenuItem
    option: Item[]
    spice: Item
}

type ShoppingCartProviderProps = {
    children: ReactNode
}

type ShoppingCartContext = {
    addToCart: (item: MenuItem, option: Item[], spice: Item) => void 
    clearCart: () => void
    getCartItems: () => CartItem[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}


export function ShoppingCartProvider( { children }: ShoppingCartProviderProps ){

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    function addToCart(item: MenuItem, option: Item[], spice: Item) {
        const newCartItems : CartItem[] = [...cartItems, {item, option, spice}];
        setCartItems(newCartItems);
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        
    };

    function clearCart() {
        const newCartItems : CartItem[] = [];
        setCartItems(newCartItems);
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        
    }

    function getCartItems() {
        return cartItems;
    }

    return (
        <ShoppingCartContext.Provider value={{ addToCart, clearCart, getCartItems }}>
            {children}
        </ShoppingCartContext.Provider>
    )
}