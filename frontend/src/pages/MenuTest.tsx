import { useQuery } from "@tanstack/react-query";
import SidebarMenu from "./SidebarMenu"; //adds the sidebar to menu
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { MenuSection } from "../components/MenuSection";
import { config } from "../config";
import useDialog from "../utils/dialogStore";
import { SectionAddForm } from "../components/forms/SectionAddForm";
import adminModeStore from "../utils/adminModeStore";
import { useShoppingCart } from "../components/ShoppingCartContext";

interface Item {
    name: string;
    price?: number;
    qty?: number;
}

const Menu = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["menuSections"],
    queryFn: () =>
      fetch(config.baseApiUrl + "/menu-section").then((res) => res.json()),
  });

  const [isAdmin, setIsAdmin] = adminModeStore((state) => [
    state.isAdmin,
    state.setIsAdmin,
  ]);
  const openDialog = useDialog((state) => state.openDialog);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem>();
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedOption, setSelectedOption] = useState<Item>({ name: "salt-pepper" });
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<Item>({ name: "mild" });

  const { addToCart, getCartItems } = useShoppingCart();

  useEffect(() => {
    setSelectedCategory(data?.[0]?.name);
  }, [data]);

  const handleAddSection = () => {
    openDialog({
      title: "Add Menu Section",
      content: <SectionAddForm />,
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

  const handleOptionChange = (e: Item) => {
    setSelectedOption(e);
  };

  const handleSpiceOptionChange = (e: Item) => {
    setSelectedSpiceLevel(e);
  };

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
    "Extra 1st Sauce +$0.50",
    "Extra 3rd Sauce +$0.50",
    "Sweet & Sour",
    "Teriyaki",
    "Spicy Mayo",
    "Honey Wasabi",
    "Dumpling Sauce",
    // Add more sauce choices here
  ];

  const SauceSelector = ({ sauceName }: { sauceName: string }) => {
    const [quantity, setQuantity] = useState(0);
  
    const handleIncrement = () => {
      setQuantity(quantity + 1);
    };
  
    const handleDecrement = () => {
      if (quantity > 0) {
        setQuantity(quantity - 1);
      }
    };
  
    const handleDelete = () => {
      setQuantity(0);
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
            className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center"
            onClick={handleIncrement}
          >
            +
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center"
            onClick={handleDecrement}
          >
            -
          </button>
        </div>
      </div>
    );    
  };

  const spicyChoices = [
    "Not Spicy",
    "Mild",
    "Medium Spicy",
    "Extra Spicy",
    "Spicy on Side",
    // Add more spicy choices here
  ];
  
  const renderSpicyChoices = () => {
    return spicyChoices.map((choice, index) => (
      <label key={index} className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-gray-600"
        />
        <span className="ml-2 text-gray-700">{choice}</span>
      </label>
    ));
  };

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
              className="w-12 text-center"
            />
            <button
              className="rounded-r bg-gray-200 px-6 py-2 font-bold text-gray-800 hover:bg-gray-400"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-bold">
            Choice of Sauce
            <span className="text-sm font-normal text-gray-400"> (up to 1 max)</span>
          </h3>
          <hr className="mb-4 border-gray-300" />
          <div className="grid grid-cols-2 gap-4">
            {sauceChoices.map((choice, index) => (
            <SauceSelector key={index} sauceName={choice} />
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-bold">
            Spicy
            <span className="text-sm font-normal text-gray-400"> (up to 1 max)</span>
          </h3>
          <hr className="mb-4 border-gray-300" />
          <div className="grid grid-cols-2 gap-2">
            {spicyChoices.map((choice, index) => (
            <div
              key={index}
              className="w-3/4 p-0 flex items-center rounded-lg border border-gray-300"
              >
              <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-gray-600"
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
              maxLength={parseInt("500")}
            ></textarea>
          </div>
          <div className="flex justify-center content-center">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold mt-3 px-2 pb-1 rounded-full"
              id="add-to-cart"
              onClick={() => addToCart(selectedItem, selectedOption, selectedSpiceLevel)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return isLoading ? (
    <div className="flex h-screen items-center justify-center">
      <img
        src="dino-sprite.png"
        alt="Bouncing Dinosaur"
        className="w-40 animate-bounce text-center"
      />
    </div>
  ) : (
    <div className="flex gap-x-4 bg-gray-50 px-12 py-20">
      <SidebarMenu
        menuSections={data}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* TODO: Remove this temporary admin toggle */}
      <div className="absolute right-2 top-28">
        <div className="flex flex-col">
          <label className="relative mb-4 inline-flex cursor-pointer items-center">
            <input
              onChange={() => setIsAdmin(!isAdmin)}
              type="checkbox"
              checked={isAdmin}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px]  after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4  peer-focus:ring-blue-300"></div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              Toggle Admin View ***TEMPORARY***
            </span>
          </label>
          {isAdmin && (
            <button
              type="button"
              className="mb-2 mr-2 rounded-lg bg-lime-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-lime-800"
              onClick={handleAddSection}
            >
              Add Menu Section
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-12">
        {selectedCategory === "all"
          ? data.map((menuSection: MenuSection) => (
              <MenuSection
                menuSection={menuSection}
                handleAddToCart={handleAddToCart}
              />
            ))
          : data.find(
              (menuSection: MenuSection) =>
                menuSection.name === selectedCategory
            ) && (
              <MenuSection
                key={
                  data.find(
                    (menuSection: MenuSection) =>
                      menuSection.name === selectedCategory
                  )?.id
                }
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