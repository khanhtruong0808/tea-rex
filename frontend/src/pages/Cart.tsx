import { useQuery } from "@tanstack/react-query";
import { config } from "../config";
import { useShoppingCart } from "../components/ShoppingCartContext";
import { useState } from "react";
import Stripe from "../components/Stripe";

const Cart = () => {

  const { data, isLoading } = useQuery({
    queryKey: ["menuSections"],
    queryFn: () =>
      fetch(config.baseApiUrl + "/menu-section").then((res) => res.json()),
  });

  const { getCartItems, clearCart } = useShoppingCart();
  
  const cart = getCartItems();

  const subtotal = cart.reduce((acc: number, item) => {
    const itemPrice = Number(item.item.price);
  
    const optionsTotal = item.option.reduce(
      (optionAccumulator: number, option) => {
        console.log(option);
        const optionPrice = option.price ? Number(option.price) * option.qty : 0;
        return optionAccumulator + optionPrice;
      },
      0
    );
  
    return acc + itemPrice + optionsTotal;
  }, 0);
  

  console.log(subtotal);

  const tax = subtotal * 0.0875;

  const total = subtotal + tax;

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCancel = () => {
    setIsCheckingOut(false);
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <img
        src="dino-sprite.png"
        alt="Bouncing Dinosaur"
        className="animate-bounce w-40 text-center"
      />
    </div>
  ) : (
    <div className="relative flex flex-col">
        <div className="flex">

            {/* Left Column */}
            {isCheckingOut && (
                <div className="w-1/2 p-5">
                    <Stripe totalAmount={Number(total.toFixed(2)) * 100} onCancelCheckout={handleCancel} />
                </div>
            )}

            {/* Right Column */}
            <div className={isCheckingOut ? "w-1/2 p-5" : "w-full p-5"} border-solid border-black>
                {/* List of Items */}
                <div className="relative flex flex-col">
                    <div className="w-9/12 mx-auto p-5 max-w-lg border-solid border-black">
                        {cart.map((item, id) => (
                            <>
                                <article key={id} className="my-2 relative">
                                    <h1 className="text-left w-3/6 self-center inline-block font-semibold text-xl">
                                        {item.item.name}
                                    </h1>
                                    <h1 className="text-right w-1/4 pr-4 self-center inline-block font-semibold text-xl">
                                        ${item.item.price}
                                    </h1>
                                </article>

                                <article>
                                    {item.option.map((options) => (
                                        <>
                                            <p className="text-left inline-block font-semibold text-sm">
                                                {options.qty}
                                            </p>
                                            <p className="text-left pl-4 inline-block font-semibold text-sm">
                                                {options.name}
                                            </p>
                                            <br />
                                        </>
                                    ))}

                                    <p className="text-left inline-block font-semibold text-sm">
                                        {item.spice.qty}
                                    </p>
                                    <p className="text-left pl-4 inline-block font-semibold text-sm">
                                        {item.spice.name}
                                     </p>
                                </article>
                            </>
                        ))}
                    </div>

                    <div className="w-9/12 mx-auto p-5 max-w-lg border-solid border-black">
                        <hr className="bg-black border-black h-0.5 mr-32"></hr>
                        <article>
                            <p className="w-3/6 self center font-bold text-left inline-block">
                                Subtotal: 
                            </p>
                            <p className="text-right w-1/4 pr-4 self-center inline-block font-bold">
                                ${subtotal.toFixed(2)}
                            </p>
                        </article>
                        <article>
                            <p className="w-3/6 self center font-bold text-left inline-block">
                                Tax: 
                            </p>
                            <p className="text-right w-1/4 pr-4 self-center inline-block font-bold">
                                ${tax.toFixed(2)}
                            </p>
                        </article>
                        <article>
                            <p className="w-3/6 self center font-bold text-left inline-block">
                                Total: 
                            </p>
                            <p className="text-right w-1/4 pr-4 self-center inline-block font-bold">
                                ${total.toFixed(2)}
                            </p>
                        </article>

                        {!isCheckingOut && (
                            <>
                                <button className="float-left mt-4 inline font-semibold bg-gray-500 hover:bg-gray-700 text-white px-2 pb-1 rounded-full" onClick={() => clearCart()}>
                                    Clear Cart
                                </button>
                                <button className="float-right mt-4 mr-28 inline font-semibold bg-lime-700 hover:scale-110 transition lg:block text-white px-2 pb-1 rounded-full" onClick={() => setIsCheckingOut(true)}>
                                    Proceed to Checkout
                                </button>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Cart;
