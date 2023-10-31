import { useQuery } from "@tanstack/react-query";
import SidebarMenu from "./SidebarMenu";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import { MenuSection } from "../components/MenuSection";
import { config } from "../config";
import useDialog from "../utils/dialogStore";
import adminModeStore from "../utils/adminModeStore";
import { useShoppingCart } from "../components/ShoppingCartProvider";
import { SauceSelector } from "../components/SauceSelector";
import DeliveryOption from "../components/DeliveryOption";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

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

const Menu = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["menuSections"],
    queryFn: () =>
      fetch(config.baseApiUrl + "/menu-section").then((res) => res.json()),
  });

  const [isAdmin] = adminModeStore((state) => [state.isAdmin]);
  const openDialog = useDialog((state) => state.openDialog);
  const closeDialog = useDialog((state) => state.closeDialog);

  // modal stuff
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem>();
  const [selectedOption, setSelectedOption] = useState<Item[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState({
    name: "",
    qty: -1,
  });
  const [selectedCupSize, setSelectedCupSize] = useState<Item>({
    name: "",
    qty: -1,
  });
  const [selectedIceLevel, setSelectedIceLevel] = useState<Item>({
    name: "",
    qty: -1,
  });
  const [selectedSugarLevel, setSelectedSugarLevel] = useState<Item>({
    name: "",
    qty: -1,
  });
  const [selectedToppings, setSelectedToppings] = useState<Item[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // error states
  const [spiceError, setSpiceError] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [iceError, setIceError] = useState(false);
  const [sugarError, setSugarError] = useState(false);

  // category selected on sidebar
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      adminModeStore.setState({ isAdmin: true });
    }
  }, []);

  const { addToCart } = useShoppingCart();

  const [showLoading, setShowLoading] = useState(false);

  // Introduce a delay for showing the loading screen
  // Only display the loading screen if the data is not yet loaded
  // AND it has been loading for more than 4 seconds
  useEffect(() => {
    const loadingDelay = setTimeout(() => {
      setShowLoading(true);
    }, 4000); // Delay for 4 seconds

    // Cleanup the timeout to prevent memory leaks
    return () => {
      clearTimeout(loadingDelay);
    };
  }, []); // Empty dependency array to run the effect once

  if (showLoading && isLoading) {
    return (
      <div className="relative flex flex-col items-center justify-center">
        <img
          src="tearex.png"
          alt="tearex.png"
          className="ml-10 w-[40%] animate-pulse text-center" // Other classes can be used alongside inline styles
        />
        {/* MAKE GIF INSTEAD OF LAYERING TO MAKE SCREEN RESPONSIVE
        <div
          className="relative flex items-center justify-center animate-pulse"
          style={{
            top: "-375px",
            left: "-110px",
            transform: "rotate(-65deg)",
          }} // not mobile friendly yet
        >
          <PulseLoader
            color={"#000000"}
            loading={true} // Show loading screen for 4 seconds
            size={15}
            margin={15}
          />
        </div> */}
      </div>
    );
  }
  if (isLoading) return null;

  // required for react-modal to avoid warning of accessibility
  Modal.setAppElement("body");

  const handleLogout = () => {
    // Clear the admin mode state

    adminModeStore.setState({ isAdmin: false });
    localStorage.removeItem("token");
    fetch("/logout", {
      method: "GET",
    })
      .then((response) => {
        if (response.status === 200) {
          navigate("/Admin");
        } else {
        }
      })
      .catch((error) => {});
  };

  // function when clicking add to cart button
  const handleAddToCart = (item: MenuItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(undefined);
    setShowModal(false);

    // reset modal form state for next item to be added
    setQuantity(1);
    setSelectedSpiceLevel({ name: "", qty: -1 });
    setSelectedCupSize({ name: "", qty: -1 });
    setSelectedIceLevel({ name: "", qty: -1 });
    setSelectedSugarLevel({ name: "", qty: -1 });
    setSelectedToppings([]);
    setSpecialInstructions("");
    setSelectedOption([]);
    setSpiceError(false);
    setSizeError(false);
    setIceError(false);
    setSugarError(false);
  };

  const handleMobileSetSelectedCategory = (category: string) => {
    setSelectedCategory(category);
    closeDialog();
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1);
  };

  const handleOpenMobileMenu = () => {
    openDialog({
      title: "",
      content: (
        <SidebarMenu
          menuSections={data}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleMobileSetSelectedCategory}
        />
      ),
    });
  };

  const handleSpiceLevelChange = (choice: string, qty: number) => {
    setSelectedSpiceLevel({ name: choice, qty });
    setSpiceError(false);
  };

  // function when adding food to cart
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

    // reset modal form state for next item to be added
    setQuantity(1);
    setSelectedSpiceLevel({ name: "", qty: -1 });
    setSelectedCupSize({ name: "", qty: -1 });
    setSelectedIceLevel({ name: "", qty: -1 });
    setSelectedSugarLevel({ name: "", qty: -1 });
    setSelectedToppings([]);
    setSpecialInstructions("");
    setSelectedOption([]);

    handleCloseModal();
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
    console.log(sizeError, selectedCupSize);

    addToCart(selectedItem, newArr, specialInstructions, quantity);

    // reset modal form state for next item to be added
    setQuantity(1);
    setSelectedCupSize({ name: "", qty: -1 });
    setSelectedIceLevel({ name: "", qty: -1 });
    setSelectedSugarLevel({ name: "", qty: -1 });
    setSpecialInstructions("");
    setSelectedToppings([]);

    handleCloseModal();
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

  // function to add cup size with associated price
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

  const selectedItemDetails = selectedItem && (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 id="modalTitle" className="text-2xl font-bold">
          {selectedItem.name}
        </h2>
        <button
          className="text-4xl text-gray-400 hover:text-gray-800"
          onClick={handleCloseModal}
        >
          &#10005;
        </button>
      </div>
      <hr className="mb-4 h-0.5 border-black bg-black"></hr>
      <div className="px-4">
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
                  className="w-full border border-gray-300 p-2"
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
    </>
  );

  return (
    <div className="flex gap-x-4 px-4 pb-20 pt-12 lg:px-6">
      <button
        className="fixed z-50 block rounded-full bg-lime-700 px-4 py-6 text-sm font-bold text-white shadow-md hover:bg-lime-800 md:hidden"
        onClick={handleOpenMobileMenu}
      >
        Menu
      </button>
      <div className="hidden md:block">
        <SidebarMenu
          menuSections={data}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div className="fixed pt-9 lg:px-40">
          <DeliveryOption />
        </div>
      </div>

      <div className="absolute right-2 top-28">
        <div className="flex flex-col">
          {isAdmin && (
            <div className="z-10">
              <div className="justify-center">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-md border-red-500 bg-red-500 px-5 py-1 text-white"
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-12">
        {selectedCategory === "all"
          ? data.map((menuSection: MenuSection) => (
              <MenuSection
                key={menuSection.id}
                menuSection={menuSection}
                handleAddToCart={handleAddToCart}
              />
            ))
          : data.find(
              (menuSection: MenuSection) =>
                menuSection.name === selectedCategory,
            ) && (
              <MenuSection
                menuSection={data.find(
                  (menuSection: MenuSection) =>
                    menuSection.name === selectedCategory,
                )}
                handleAddToCart={handleAddToCart}
              />
            )}
      </div>

      {/* Add to cart modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        className="max-w-700 fixed left-1/2 top-1/2 z-50 max-h-[600px] w-8/12 -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-lg border-2 border-gray-300 bg-white p-5 shadow-md md:w-6/12 lg:w-6/12"
      >
        {selectedItemDetails}
      </Modal>
    </div>
  );
};

export default Menu;
