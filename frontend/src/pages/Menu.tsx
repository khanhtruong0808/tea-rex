import { useQuery } from "@tanstack/react-query";
import SidebarMenu from "./SidebarMenu"; //adds the sidebar to menu
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { MenuSection } from "../components/MenuSection";
import { config } from "../config";
import useDialog from "../utils/dialogStore";
import { SectionAddForm } from "../components/forms/SectionAddForm";
import adminModeStore from "../utils/adminModeStore";

interface Item {
  name: string;
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
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState();
  console.log(selectedCategory);

  useEffect(() => {
    setSelectedCategory(data?.[0]?.name);
  }, [data]);

  const handleAddSection = () => {
    openDialog({
      title: "Add Menu Section",
      content: <SectionAddForm />,
    });
  };

  const handleAddToCart = (item: Item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(undefined);
    setShowModal(false);
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
          <hr className="mb-4 border-gray-300"></hr>
          <div className="flex flex-col">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-gray-600"
              />
              <span className="ml-2 text-gray-700">
                Salt &amp; Pepper On Side
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-gray-600"
              />
              <span className="ml-2 text-gray-700">Sauce on the Side</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-gray-600"
              />
              <span className="ml-2 text-gray-700">Extra 2nd Sauce</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-gray-600"
              />
              <span className="ml-2 text-gray-700">Ranch</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-gray-600"
              />
              <span className="ml-2 text-gray-700">Sweet Red Chili</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-gray-600"
              />
              <span className="ml-2 text-gray-700">Orange Sauce</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-gray-600"
              />
              <span className="ml-2 text-gray-700">
                Tea Rex Special Sauce (BBQ){" "}
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-gray-600"
              />
              <span className="ml-2 text-gray-700">Hoisin Sauce</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-gray-600"
              />
              <span className="ml-2 text-gray-700">Garlic Sauce</span>
            </label>
            <div className="ml-6 flex flex-col">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">Spicy on Side</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">
                  Extra 1st Sauce +$0.50
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">
                  Extra 3rd Sauce +$0.50
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">Sweet & Sour</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">Teriyaki</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">Spicy Mayo</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">Honey Wasabi</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">Dumpling Sauce</span>
              </label>
              {/* Add more sauce choices here */}
            </div>
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
          <hr className="mb-4 border-gray-300"></hr>
          <div className="flex flex-col">
            <div className="flex flex-row items-start">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">Mild</span>
              </label>
              <div className="ml-60 mr-16 p-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-gray-600"
                  />
                  <span className="ml-2 text-gray-700">Medium Spicy</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">Extra Spicy</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">Spicy on Side</span>
              </label>
            </div>
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
