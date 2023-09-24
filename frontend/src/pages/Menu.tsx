import { useQuery } from "@tanstack/react-query";
import SidebarMenu from "./SidebarMenu";
import { useState } from "react";
import Modal from "react-modal";
import { MenuSection } from "../components/MenuSection";
import { config } from "../config";
import useDialog from "../utils/dialogStore";
import adminModeStore from "../utils/adminModeStore";
import { useShoppingCart } from "../components/ShoppingCartContext";
import { SauceSelector } from "../components/SauceSelector";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem>();
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedOption, setSelectedOption] = useState<Item[]>([]);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState({
    name: "mild",
    qty: 1,
  });

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

  const handleLogout = () => {
    // Clear the admin mode state
    adminModeStore.setState({ isAdmin: false });
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

    addToCart(selectedItem, newOptionArr, selectedSpiceLevel);

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
            <span className="text-sm font-normal text-gray-400">
              {" "}
              (up to 1 max)
            </span>
          </h3>
          <hr className="mb-4 border-gray-300" />
          <div className="grid grid-cols-2 gap-4">
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
              maxLength={parseInt("500")}
            ></textarea>
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
                key={data.name}
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
