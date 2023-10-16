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
import axios from 'axios';

const sauceChoices = [
  "Salt & Pepper On Side",
  "Sauce on the Side",
  "Extra 2nd Sauce +$0.50",
  "Ranch",
  "Sweet Red Chili",
  "Orange Sauce",
  "Tea Rex Special Sauce (BBQ)",
  "Hoisin Sauce",
  "Garlic Sauce",
  "Spicy on Side",
  "Extra 1st Sauce +$0.50",
  "Extra 3rd Sauce +$0.50",
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
  "Aloe Vera +$0.85",
  "Crystal Boba +$0.85",
  "Honey +$0.85",
  "Coffee Jelly +$0.85",
  "Lychee Jelly +$0.85",
  "Strawberry Jelly +$0.85",
  "Oreo Crumbles +$0.85",
  "Mango Pop +$0.85",
  "Str Pop +$0.85",
  "Chunk: Mango +$0.85",
  "Extra Toppings +$0.85",
  "Boba +$0.85",
  "Chia Seed +$0.85",
  "Egg Pudding +$0.85",
  "Grass Jelly +$0.85",
  "Mango Jelly +$0.85",
  "Rainbow Jelly +$0.85",
  "Green Apple Pop +$0.85",
  "PF Pop +$0.85",
  "Rainbow Poping +$0.85",
  "Red Bean +$0.85",
  "Mix +$0.85",
  // Add more boba choices here
];

const iceChoices = [
  "No Ice",
  "Less Ice",
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
    name: "mild",
    qty: 1,
  });
  const [specialInstructions, setSpecialInstructions] = useState("");

  // category selected on sidebar
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const navigate = useNavigate();
  useEffect(() => {
    
    const token = localStorage.getItem("token");

    if(token) {
      adminModeStore.setState({ isAdmin: true});
    }
    //const isAdmin = localStorage.getItem("isAdmin") === "true";
    //adminModeStore.setState({ isAdmin });
  }, []);


  const { addToCart } = useShoppingCart();

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <img
          src="dino-sprite.png"
          alt="Bouncing Dinosaur"
          className="w-40 animate-bounce text-center"
        />
      </div>
    );

  // required for react-modal to avoid warning of accessibility
  Modal.setAppElement("body");

  const handleLogout = () => {
    // Clear the admin mode state

    adminModeStore.setState({ isAdmin: false });
    localStorage.removeItem("token");
    fetch('/logout', {
      method: 'GET',
    })
      .then((response) => {
        if (response.status === 200) {
          navigate('/Admin');
        } else {
    
        }
      })
      .catch((error) => {
  
      });

  };

  const handleAddToCart = (item: MenuItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(undefined);
    setShowModal(false);
  };

  const handleSpiceOptionChange = (e: Item) => {
    setSelectedSpiceLevel(e);
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

  const handleCartFunction = (
    selectedItem: MenuItem,
    selectedOption: Item[],
    selectedSpiceLevel: Item
  ) => {
    const newOptionArr = selectedOption.filter((x) => x.qty !== 0);

    newOptionArr.map((x) =>
      x.name === "Extra 1st Sauce +$0.50" ||
      x.name === "Extra 2nd Sauce +$0.50" ||
      x.name === "Extra 3rd Sauce +$0.50"
        ? (x.price = 0.5)
        : x
    );

    newOptionArr.map((x) => x.qty + 1);

    addToCart(
      selectedItem,
      newOptionArr,
      selectedSpiceLevel,
      specialInstructions,
      quantity
    );

    // reset modal form state for next item to be added
    setQuantity(1);
    setSelectedSpiceLevel({ name: "mild", qty: 1 });
    setSpecialInstructions("");
    setSelectedOption([]);

    handleCloseModal();
  };

  const collectAllOptionQuantity = (sauceName: string, quantity: number) => {
    const exist = selectedOption.find((x) => x.name === sauceName);

    if (exist) {
      const newSelectedOption = selectedOption.map((x) =>
        x.name === sauceName ? { ...exist, qty: quantity } : x
      );
      setSelectedOption(newSelectedOption);
    } else {
      const newSelectedOption = [
        ...selectedOption,
        { name: sauceName, qty: 1 },
      ];
      setSelectedOption(newSelectedOption);
    }
  };

  const renderChoices = (choices: string[]) => {
    return choices.map((choice: string, index: number) => (
      <label key={index} className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-gray-600"
        />
        <span className="ml-2 text-gray-700">{choice}</span>
      </label>
    ));
  };

  const renderCupChoices = () => renderChoices(cupChoices);
  const renderBobaChoices = () => renderChoices(bobaChoices);
  const renderIceChoices = () => renderChoices(iceChoices);
  const renderSugarChoices = () => renderChoices(sugarChoices);

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
              className="rounded-l bg-gray-200 px-6 py-2 font-bold text-gray-800 hover:bg-gray-400"
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
              className="rounded-r bg-gray-200 px-6 py-2 font-bold text-gray-800 hover:bg-gray-400"
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
                  (up to 1 max)
                </span>
              </h3>
              <hr className="mb-4 border-gray-300" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-screen-lg mx-auto">
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
              <h3 className="mb-2 text-lg font-bold">
                Spicy
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  (up to 1 max)
                </span>
              </h3>
              <hr className="mb-4 border-gray-300" />
              <div className="grid grid-cols-2 gap-2">
                {spicyChoices.map((choice, index) => (
                  <div
                    key={index}
                    className="flex w-3/4 items-center rounded-lg border border-gray-300 p-0"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-gray-600"
                      checked={selectedSpiceLevel.name === choice}
                      onChange={() =>
                        handleSpiceOptionChange({ name: choice, qty: 1 })
                      }
                    />
                    <span className="ml-2 text-gray-700">{choice}</span>
                  </div>
                ))}
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
                  className="mt-3 rounded-full bg-gray-500 px-2 pb-1 font-bold text-white hover:bg-gray-700"
                  id="add-to-cart"
                  onClick={() =>
                    handleCartFunction(
                      selectedItem,
                      selectedOption,
                      selectedSpiceLevel
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
              <h3 className="mb-2 text-lg font-bold">
                Cup Size
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  (Required* Please select 1)
                </span>
              </h3>
              <hr className="mb-4 border-gray-300" />
              <div className="grid grid-cols-2 gap-2">{renderCupChoices()}</div>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-lg font-bold">
                Add Boba Jelly
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  (Please select up to 3)
                </span>
              </h3>
              <hr className="mb-4 border-gray-300" />
              <div className="grid grid-cols-2 gap-2">
                {renderBobaChoices()}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-lg font-bold">
                Ice Level
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  (Please select up to 1)
                </span>
              </h3>
              <hr className="mb-4 border-gray-300" />
              <div className="grid grid-cols-2 gap-2">{renderIceChoices()}</div>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-lg font-bold">
                Sugar Level
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  (Please select up to 1)
                </span>
              </h3>
              <hr className="mb-4 border-gray-300" />
              <div className="grid grid-cols-2 gap-2">
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
                  className="mt-3 rounded-full bg-gray-500 px-2 pb-1 font-bold text-white hover:bg-gray-700"
                  id="add-to-cart"
                  onClick={() =>
                    handleCartFunction(
                      selectedItem,
                      selectedOption,
                      selectedSpiceLevel
                    )
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
    <div className="flex gap-x-4 px-4 lg:px-6 pt-12 pb-20">
      <button
        className="block md:hidden z-50 fixed rounded-full shadow-md bg-lime-700 px-4 py-6 text-sm font-bold text-white hover:bg-lime-800"
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
        <div className="fixed lg:px-40 pt-9">
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
                menuSection.name === selectedCategory
            ) && (
              <MenuSection
                menuSection={data.find(
                  (menuSection: MenuSection) =>
                    menuSection.name === selectedCategory
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
