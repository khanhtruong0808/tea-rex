interface ShoppingCartListProps {
  cartItems: CartItem[];
  className: string;
}

export const ShoppingCartList = ({
  cartItems,
  className,
}: ShoppingCartListProps) => {
  return (
    <div className={`${className} mt-8`}>
      <div className="flow-root">
        <ul role="list" className="-my-6 divide-y divide-gray-200">
          {cartItems.map((item, index) => {
            const menuItem = item.item;
            const options = item.option;
            const spice = item.spice;
            return (
              <li key={index} className="flex py-6">
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        {item.quantity}x {menuItem.name}
                      </h3>
                      <p className="ml-4">
                        ${(menuItem.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.specialInstructions &&
                        `Note: ${item.specialInstructions}`}
                    </p>
                    {options.map((option) => (
                      <div className="flex justify-between text-sm">
                        <p className="mt-1 text-gray-500">
                          {option.qty}x {option.name}
                        </p>
                        <p className="ml-4 text-gray-900 font-medium">
                          {option.name.includes("+$0.50") && "$0.50"}
                        </p>
                      </div>
                    ))}
                    <p className="mt-1 text-sm text-gray-500">{spice.name}</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm mt-4">
                    <div className="flex">
                      <button
                        type="button"
                        className="font-medium text-lime-600 hover:text-lime-500"
                      >
                        Edit/Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
