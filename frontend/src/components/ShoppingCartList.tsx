import { useShoppingCart } from "./ShoppingCartProvider";

interface ShoppingCartListProps {
  cartItems: CartItem[];
  className: string;
}

export const ShoppingCartList = ({
  cartItems,
  className,
}: ShoppingCartListProps) => {
  const { removeItem } = useShoppingCart();

  return (
    <div className={`${className} mt-8`}>
      <div className="flow-root">
        <ul role="list" className="-my-6 divide-y divide-gray-200">
          {cartItems.map((item, index) => {
            const itemID = item.id;
            const menuItem = item.item;
            const options = item.option;
            const sortedOptions = options.sort((a: any, b: any) => {
              if (a.qty < b.qty) {
                return -1;
              }
              if (a.qty > b.qty) {
                return 1;
              }
              return 0;
            });
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
                    {item.spice !== undefined && (
                      <p className="mt-1 text-sm text-gray-500">
                        {item.spice.name}
                      </p>
                    )}
                    {sortedOptions.map((option) => (
                      <div
                        className="flex justify-between text-sm"
                        key={option.name}
                      >
                        <p className="mt-1 text-gray-500">
                          {option.qty !== -1 && `${option.qty}x`} {option.name}
                        </p>
                        {option.price !== undefined && (
                          <p className="ml-4 font-medium text-gray-900">
                            ${Math.abs(option.price * option.qty).toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-1 items-end justify-between text-sm">
                    <div className="flex">
                      <button
                        type="button"
                        className="pr-1 font-medium text-lime-600 hover:text-lime-500"
                      >
                        Edit
                      </button>
                      <p>|</p>
                      <button
                        type="button"
                        className="pl-1 font-medium text-lime-600 hover:text-lime-500"
                        onClick={() => removeItem(itemID)}
                      >
                        Remove
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
