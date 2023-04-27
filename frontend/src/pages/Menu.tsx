import { useQuery } from "@tanstack/react-query";
import SidebarMenu from "./SidebarMenu"; //adds the sidebar to menu
import { useState } from "react";
import Modal from "react-modal";
import { MenuSection } from "../components/MenuSection";
import { config } from "../config";
import useDialog from "../utils/dialogStore";
import { SectionAddForm } from "../components/forms/SectionAddForm";
import adminModeStore from "../utils/adminModeStore";

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

  const handleAddSection = () => {
    openDialog({
      title: "Add Menu Section",
      content: <SectionAddForm />,
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string } | null>(
    null
  );

  type Item = { name: string };
  const handleAddToCart = (item: Item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowModal(false);
  };

  const [quantity, setQuantity] = useState(1);

  const selectedItemDetails = selectedItem ? (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 id="modalTitle" className="text-2xl font-bold">
          {selectedItem.name}
        </h2>
        <button
          className="text-gray-400 hover:text-gray-800 text-4xl"
          onClick={handleCloseModal}
        >
          &#10005;
        </button>
      </div>
      <hr className="bg-black border-black h-0.5 mb-4"></hr>
      <div className="px-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold mb-2">Quantity:</h3>
          <div className="flex items-center">
            <button
              className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-l"
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
              className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-r"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">
            Choice of Sauce
            <span className="text-gray-400 text-sm font-normal">
              {" "}
              (up to 1 max)
            </span>
          </h3>
          <hr className="border-gray-300 mb-4"></hr>
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
            <div className="flex flex-col ml-6">
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
          <h3 className="text-lg font-bold mb-2">
            Spicy
          <span className="text-gray-400 text-sm font-normal">
            {" "}
            (up to 1 max)
          </span>
          </h3>
          <hr className="border-gray-300 mb-4"></hr>
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
          <h3 className="text-lg font-bold mb-2">
            Special Instructions
          </h3>
          <hr className="border-gray-300 mb-4"></hr>
          <div>
            <textarea
              className="border border-gray-300 p-2 w-full"
              rows={3}
              placeholder="Food allergy? Need something to put to the side? Let us know. (additional charges may apply and not all changes are possible)"
              maxLength={parseInt("500")}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  ) : null;

  const tailwindStyles = {
    modal: {
      content:
        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 w-8/12 md:w-6/12 lg:w-6/12 max-w-700 max-h-[700px] overflow-y-auto border-2 border-gray-300 rounded-lg shadow-md",
      maxHeight: "calc(100vh - 200px)",
      scrollbar: {
        width: "10px",
        backgroundColor: "#f5f5f5",
        thumb: {
          backgroundColor: "#aaa",
          borderRadius: "10px",
        },
      },
    },
  };  

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <img
        src="dino-sprite.png"
        alt="Bouncing Dinosaur"
        className="animate-bounce w-40 text-center"
      />
    </div>
  ) : (
    <div className="w-9/12 mx-auto p-5 max-w-lg">
      <div className="flex">
        <SidebarMenu menuSections={data} />
      </div>
      <div className="absolute right-2">
        <div className="flex flex-col">
          <label className="relative inline-flex items-center mb-4 cursor-pointer">
            <input
              onChange={() => setIsAdmin(!isAdmin)}
              type="checkbox"
              value=""
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              Toggle Admin View
            </span>
          </label>
          {isAdmin && (
            <button
              type="button"
              className="text-white bg-lime-700 hover:bg-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
              onClick={handleAddSection}
            >
              Add Menu Section
            </button>
          )}
        </div>
      </div>
      {data.map((menuSection: MenuSection) => (
        <MenuSection
          key={menuSection.id}
          menuSection={menuSection}
          handleAddToCart={handleAddToCart}
        />
      ))}
      <Modal isOpen={showModal} onRequestClose={handleCloseModal} className={tailwindStyles.modal.content}>
        {selectedItemDetails}
      </Modal>
    </div>
  );
};

export default Menu;
