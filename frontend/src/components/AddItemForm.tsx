import { useState } from "react";
import useDialog from "../utils/dialogStore";
import { SauceSelector } from "./SauceSelector";
import { useShoppingCart } from "./ShoppingCartProvider";

const sauceChoices = [
  "Salt & Pepper On Side",
  "Sauce on the Side",
  "Extra 2nd Sauce",
  "Ranch",
  "Sweet Red Chili",
  "Orange Sauce",
  "Tea Rex Special Sauce (BBQ)",
  "Hoisin Sauce",
  "Garlic Sauce",
  "Spicy on Side",
  "Extra 1st Sauce",
  "Extra 3rd Sauce",
  "Sweet & Sour",
  "Teriyaki",
  "Spicy Mayo",
  "Honey Wasabi",
  "Dumpling Sauce",
  // Add more sauce choices here
];

const spicyChoices = [
  "Not Spicy",
  "Mild",
  "Medium Spicy",
  "Extra Spicy",
  "Spicy on Side",
  // Add more spicy choices here
];

const cupChoices = [
  "16 oz",
  "24 oz +$0.50",
  "Hot +$1.00",
  // Add more cup choices here
];

const bobaChoices = [
  "Aloe Vera",
  "Crystal Boba",
  "Honey",
  "Coffee Jelly",
  "Lychee Jelly",
  "Strawberry Jelly",
  "Oreo Crumbles",
  "Mango Pop",
  "Str Pop",
  "Chunk: Mango",
  "Extra Toppings",
  "Boba",
  "Chia Seed",
  "Egg Pudding",
  "Grass Jelly",
  "Mango Jelly",
  "Rainbow Jelly",
  "Green Apple Pop",
  "PF Pop",
  "Rainbow Poping",
  "Red Bean",
  "Mix",
  // Add more boba choices here
];

const iceChoices = [
  "No Ice",
  "Less Ice",
  "Normal Ice",
  "More Ice",
  // Add more ice choices here
];

const sugarChoices = [
  "0% Sugar",
  "25% Sugar",
  "50% Sugar",
  "75% Sugar",
  "100% Sugar",
  "125% Sugar",
  // Add more sugar choices here
];

interface Item {
  id?: number;
  name: string;
  price?: number;
  qty: number;
}

interface AddItemFormProps {
  selectedItem: MenuItem;
}

export const AddItemForm = ({ selectedItem }: AddItemFormProps) => {
  const { closeDialog } = useDialog();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<Item[]>([]);
  const [spiceError, setSpiceError] = useState(false);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<Item>({
    name: "",
    qty: 0,
  });
  const [sizeError, setSizeError] = useState(false);
  const [selectedCupSize, setSelectedCupSize] = useState<Item>({
    name: "",
    qty: 0,
  });
  const [selectedToppings, setSelectedToppings] = useState<Item[]>([]);
  const [iceError, setIceError] = useState(false);
  const [selectedIceLevel, setSelectedIceLevel] = useState<Item>({
    name: "",
    qty: 0,
  });
  const [sugarError, setSugarError] = useState(false);
  const [selectedSugarLevel, setSelectedSugarLevel] = useState<Item>({
    name: "",
    qty: 0,
  });
  const [specialInstructions, setSpecialInstructions] = useState("");

  const { addToCart } = useShoppingCart();

  const handleSpiceLevelChange = (choice: string, qty: number) => {
    setSelectedSpiceLevel({ name: choice, qty });
    setSpiceError(false);
  };

  const collectAllOptionQuantity = (sauceName: string, quantity: number) => {
    const exist = selectedOption.find((x) => x.name === sauceName);

    if (exist) {
      const newSelectedOption = selectedOption.map((x) =>
        x.name === sauceName ? { ...exist, qty: quantity, price: 0.5 } : x,
      );
      setSelectedOption(newSelectedOption);
    } else {
      const newSelectedOption = [
        ...selectedOption,
        { name: sauceName, qty: 1, price: 0.5 },
      ];
      setSelectedOption(newSelectedOption);
    }
  };

  const handleCupSize = (name: string, qty: number) => {
    if (name === "24 oz +$0.50") {
      setSelectedCupSize({ name: name, qty: -1, price: 0.5 });
    } else if (name === "Hot +$1.00") {
      setSelectedCupSize({ name: name, qty: -1, price: 1.0 });
    } else {
      setSelectedCupSize({ name: name, qty: -1 });
    }
  };

  const handleToppings = (name: string, qty: number) => {
    if (name.includes("oz") || name.includes("Hot")) {
      setSizeError(false);
      handleCupSize(name, -1);
    } else if (name.includes("Ice")) {
      setIceError(false);
      setSelectedIceLevel({ name: name, qty: -1 });
    } else if (name.includes("Sugar")) {
      setSugarError(false);
      setSelectedSugarLevel({ name: name, qty: -1 });
    } else {
      const exist = selectedToppings.find((x) => x.name === name);
      // if toppings exist, remove it from the array
      if (exist) {
        const newSelectedToppings = selectedToppings.filter(
          (x) => x.name !== name,
        );
        setSelectedToppings(newSelectedToppings);
      } else {
        // else add it to the array
        const newSelectedToppings = [
          ...selectedToppings,
          { name: name, qty: 1, price: 0.85 },
        ];
        setSelectedToppings(newSelectedToppings);
      }
    }
  };

  const handleAddFoodToCart = (
    selectedItem: MenuItem,
    selectedOption: Item[],
    selectedSpiceLevel: Item,
  ) => {
    if (selectedSpiceLevel.name === "") {
      setSpiceError(true);
      return;
    }

    const newOptionArr = selectedOption.filter((x) => x.qty !== 0);

    newOptionArr.map((x) => x.qty + 1);

    addToCart(
      selectedItem,
      newOptionArr,
      specialInstructions,
      quantity,
      selectedSpiceLevel,
    );

    closeDialog();
  };

  // function to handle adding beverages to cart
  const handleAddBeverageToCart = (
    selectedItem: MenuItem,
    selectedToppings: Item[],
  ) => {
    const newArr = [
      ...selectedToppings,
      selectedCupSize,
      selectedIceLevel,
      selectedSugarLevel,
    ];

    // check if any errors and return at the end to populate each error
    let isError = false;
    if (selectedCupSize.name === "") {
      setSizeError(true);
      isError = true;
    }
    if (selectedIceLevel.name === "") {
      setIceError(true);
      isError = true;
    }
    if (selectedSugarLevel.name === "") {
      setSugarError(true);
      isError = true;
    }

    if (isError) return;

    addToCart(selectedItem, newArr, specialInstructions, quantity);
    closeDialog();
  };

  const renderChoices = (choices: string[], selectedValue: string) => {
    return choices.map((choice: string, index: number) => {
      const selected = selectedValue === choice;
      return (
        <label
          key={index}
          className={`relative mb-2 block cursor-pointer rounded-lg bg-white shadow-lg ${
            selected
              ? "border-2 border-orange-300"
              : "border border-transparent hover:border-gray-300"
          }`}
        >
          <input
            type="checkbox"
            className="form-checkbox absolute h-6 w-6 opacity-0"
            onChange={() => handleToppings(choice, -1)}
            checked={selected}
          />
          <div className="flex items-center p-4">
            <span className="text-gray-700">{choice}</span>
          </div>
        </label>
      );
    });
  };

  const renderToppings = (toppings: string[]) => {
    return toppings.map((choice: string, index: number) => {
      const selected = selectedToppings.some((x: any) => x.name === choice);
      const disabled = selectedToppings.length >= 3 && !selected;
      return (
        <label
          key={index}
          aria-disabled={disabled}
          className={`relative mb-2 block cursor-pointer rounded-lg bg-white shadow-lg aria-disabled:cursor-not-allowed aria-disabled:border-none aria-disabled:opacity-50 ${
            selected
              ? "border-2 border-orange-300"
              : "border border-transparent hover:border-gray-300"
          }`}
        >
          <input
            type="checkbox"
            className="form-checkbox absolute h-6 w-6 opacity-0"
            onChange={() => handleToppings(choice, 1)}
            checked={selected}
            disabled={disabled}
          />
          <div className="flex items-center p-4">
            <span className="text-gray-700">{choice}</span>
          </div>
        </label>
      );
    });
  };

  const renderCupChoices = () =>
    renderChoices(cupChoices, selectedCupSize.name);
  const renderBobaChoices = () => renderToppings(bobaChoices);
  const renderIceChoices = () =>
    renderChoices(iceChoices, selectedIceLevel.name);
  const renderSugarChoices = () =>
    renderChoices(sugarChoices, selectedSugarLevel.name);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 id="modalTitle" className="text-2xl font-bold">
          {selectedItem.name}
        </h2>
        <button
          className="text-4xl text-gray-400 hover:text-gray-800"
          onClick={closeDialog}
        >
          &#10005;
        </button>
      </div>
      <hr className="mb-4 h-0.5 border-black bg-black"></hr>
      <div>
        <div className="flex flex-col">
          <h3 className="mb-2 text-lg font-bold">Quantity:</h3>
          <div className="flex items-center">
            <button
              className="rounded-l bg-yellow-400 px-6 py-2 font-bold text-white hover:bg-yellow-400"
              onClick={() => setQuantity(Math.max(quantity - 1, 1))}
            >
              {" "}
              -{" "}
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(parseInt(e.target.value), 1))
              }
              className="w-20 text-center"
            />
            <button
              className="rounded-r bg-green-400 px-6 py-2 font-bold text-white hover:bg-green-500"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {selectedItem.menuType === "food" && (
          <>
            <div className="mt-4">
              <h3 className="mb-2 text-lg font-bold">
                Choice of Sauce
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  (+$0.50 per sauce)
                </span>
              </h3>
              <hr className="mb-4 border-gray-300" />
              <div className="mx-auto grid max-w-screen-lg grid-cols-1 gap-4 md:grid-cols-2">
                {sauceChoices.map((choice, index) => (
                  <SauceSelector
                    key={index}
                    sauceName={choice}
                    onQtyChange={(quantity) =>
                      collectAllOptionQuantity(choice, quantity)
                    }
                  />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h3
                className={`${
                  spiceError ? "text-bold text-red-500" : ""
                } mb-2 text-lg font-bold`}
              >
                Spicy
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  (Please select 1)
                </span>
              </h3>
              <hr className="mb-2 border-gray-300" />
              <div className="grid grid-cols-2 gap-2">
                {spiceError && (
                  <p className="col-span-full text-sm text-red-500">
                    Please select a spice level.
                  </p>
                )}
                {spicyChoices.map((choice, index) => {
                  const selected = selectedSpiceLevel.name === choice;
                  return (
                    <label
                      key={index}
                      className={`relative mb-2 block cursor-pointer rounded-lg bg-white shadow-lg ${
                        selected
                          ? "border-2 border-orange-300"
                          : "border border-transparent hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox absolute h-6 w-6 opacity-0"
                        checked={selected}
                        onChange={() => handleSpiceLevelChange(choice, -1)}
                      />
                      <div className="flex items-center p-4">
                        <span className="text-gray-700">{choice}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-lg font-bold">Special Instructions</h3>
              <hr className="mb-4 border-gray-300"></hr>
              <div>
                <textarea
                  className="w-full border border-gray-300 p-2 placeholder:text-sm sm:placeholder:text-base"
                  rows={3}
                  placeholder="Food allergy? Need something to put to the side? Let us know. (additional charges may apply and not all changes are possible)"
                  maxLength={500}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
              <div className="flex content-center justify-center">
                <button
                  className="mt-3 rounded-full bg-lime-700 px-3 py-1 font-bold text-white hover:bg-green-800"
                  id="add-to-cart"
                  onClick={() =>
                    handleAddFoodToCart(
                      selectedItem,
                      selectedOption,
                      selectedSpiceLevel,
                    )
                  }
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </>
        )}
        {selectedItem?.menuType === "beverage" && (
          <>
            <div className="mt-4">
              <h3
                className={`${
                  sizeError ? "text-bold text-red-500" : ""
                } mb-2 text-lg font-bold`}
              >
                Cup Size
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  (Please select 1)
                </span>
              </h3>
              <hr className="mb-2 border-gray-300" />
              {sizeError && (
                <p className="col-span-full text-sm text-red-500">
                  Please select a size.
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {renderCupChoices()}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-lg font-bold">
                Add Boba Jelly
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  (+$0.85 per selection, 3 max)
                </span>
              </h3>
              <hr className="mb-4 border-gray-300" />
              <div className="grid grid-cols-2 gap-2">
                {renderBobaChoices()}
              </div>
            </div>

            <div className="mt-4">
              <h3
                className={`${
                  iceError ? "text-bold text-red-500" : ""
                } mb-2 text-lg font-bold`}
              >
                Ice Level
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  (Please select 1)
                </span>
              </h3>
              <hr className="mb-2 border-gray-300" />
              {iceError && (
                <p className="col-span-full text-sm text-red-500">
                  Please select an ice level.
                </p>
              )}
              <div className="mt-2 grid grid-cols-2 gap-2">
                {renderIceChoices()}
              </div>
            </div>

            <div className="mt-4">
              <h3
                className={`${
                  sugarError ? "text-bold text-red-500" : ""
                } mb-2 text-lg font-bold`}
              >
                Sugar Level
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  (Please select 1)
                </span>
              </h3>
              <hr className="mb-2 border-gray-300" />
              {sugarError && (
                <p className="col-span-full text-sm text-red-500">
                  Please select a sugar level.
                </p>
              )}
              <div className="mt-2 grid grid-cols-2 gap-2">
                {renderSugarChoices()}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-lg font-bold">Special Instructions</h3>
              <hr className="mb-4 border-gray-300"></hr>
              <div>
                <textarea
                  className="w-full border border-gray-300 p-2"
                  rows={3}
                  placeholder="Food allergy? Need something to put to the side? Let us know. (additional charges may apply and not all changes are possible)"
                  maxLength={500}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
              <div className="flex content-center justify-center">
                <button
                  className="mt-3 rounded-full bg-green-500 px-2 pb-1 font-bold text-white hover:bg-gray-700"
                  id="add-to-cart"
                  onClick={() =>
                    handleAddBeverageToCart(selectedItem, selectedToppings)
                  }
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
