import { useState } from "react";


export const SauceSelector = ({ sauceName, onQtyChange }: { sauceName: string, onQtyChange: (quantity: number) => void }) => {
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
      <div className="w-3/4 p-0 flex items-center">
        <div className="w-[500px] rounded-lg border border-gray-300 p-2 flex items-center">
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              quantity === 0 ? 'bg-gray-200' : 'bg-red-500 text-white'
            }`}
            onClick={quantity === 0 ? handleIncrement : handleDelete}
          >
            {quantity === 0 ? '+' : 'X'}
          </button>
          <span className="w-40 whitespace-nowrap overflow-hidden overflow-ellipsis">{sauceName}</span>
          <button
            className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center"
            onClick={handleDecrement}
          >
            -
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
      </div>
    );    
  };