import { useQuery } from "@tanstack/react-query";
import { config } from "../config";

const Cart = () => {

  const { data, isLoading } = useQuery({
    queryKey: ["menuSections"],
    queryFn: () =>
      fetch(config.baseApiUrl + "/menu-section").then((res) => res.json()),
  });

  const firstFiveItems = data ? data[0].items.slice(0, 5) : [];

  const subtotal = firstFiveItems.reduce((acc: number, item: MenuItem) => acc + +item.price, 0);

  const tax = subtotal * 0.0875;

  const total = subtotal + tax;

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
        <div className="w-9/12 mx-auto p-5 max-w-lg border-solid border-black">
        {firstFiveItems.map((item: MenuItem) => (
            <article key={item.id} className="my-2 relative">
                <p className="text-left w-3/6 self-center inline-block font-semibold">
                {item.name}
                </p>
                <p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">
                    ${item.price}
                </p>
            </article>
        ))}
        </div>
        <div className="w-9/12 mx-auto p-5 max-w-lg border-solid border-black">
            <hr className="bg-black border-black h-0.5 mr-32"></hr>
            <article>
                <p className="w-3/6 self center font-bold text-left inline-block">
                    Subtotal: 
                </p>
                <p className="text-right w-1/4 pr-4 self-center inline-block font-bold">
                    ${subtotal}
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
            <button className="float-right mt-4 mr-28 inline font-semibold bg-gray-500 hover:bg-gray-700 text-white px-2 pb-1 rounded-full">
                Proceed to Checkout
            </button>
        </div>
    </div>
  );
};

export default Cart;
