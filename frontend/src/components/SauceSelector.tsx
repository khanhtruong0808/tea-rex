import { useState } from "react";

export const SauceSelector = ({
  sauceName,
  onQtyChange,
}: {
  sauceName: string;
  onQtyChange: (quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    setQuantity(quantity + 1);

    onQtyChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      onQtyChange(quantity);
    }
  };

  const handleDelete = () => {
    setQuantity(0);

    onQtyChange(0);
  };

  return (
    <div className="flex items-center p-0">
      <div className="flex w-full items-center justify-between rounded-lg border border-gray-300 p-2">
        <button
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            quantity === 0 ? "bg-gray-200" : "bg-red-500 text-white"
          }`}
          onClick={quantity === 0 ? handleIncrement : handleDelete}
        >
          {quantity === 0 ? "+" : "X"}
        </button>
        <span className="text-center">{sauceName}</span>
        <div className="flex items-center">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white"
            onClick={handleDecrement}
          >
            -
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
