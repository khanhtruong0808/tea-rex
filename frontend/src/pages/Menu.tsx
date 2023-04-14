import { useQuery } from "@tanstack/react-query";
import SidebarMenu from "./SidebarMenu"; //adds the sidebar to menu
import { useState } from "react";
import Modal from "react-modal";
import { MenuSection } from "../components/MenuSection";
import { config } from "../config";

const Menu = () => {
  const apiUrl = config.baseApiUrl;
  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch(apiUrl + "/menu").then((res) => res.json()),
  });

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
      </div>
    </>
  ) : null;

  /*const styles = {
    modal: {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '90%', // adjust the width as needed
        height: '90%', // adjust the height as needed
        maxWidth: '700px',
        maxHeight: '700px',
        overflow: 'auto'
      },
    },
  };  */

  const styles = {
    modal: {
      content:
        "top-1/2 left-1/2 right-auto bottom-auto -mr-1/2 transform translate-x-1/2 -translate-y-1/2 w-90 h-90 max-w-700 max-h-700 overflow-auto",
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
    <>
      <div className="flex">
        <SidebarMenu />
      </div>
      {data.map((menuSection: MenuSection) => (
        <MenuSection
          key={menuSection.id}
          menuSection={menuSection}
          handleAddToCart={handleAddToCart}
        />
      ))}
      <Modal isOpen={showModal} onRequestClose={handleCloseModal}>
        {selectedItemDetails}
      </Modal>
    </>
  );
};

export default Menu;
