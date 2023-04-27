import { TbTrash } from "react-icons/tb";
import { FiEdit3 } from "react-icons/fi";
import useDialog from "../utils/dialogStore";
import { SectionDeleteForm } from "./forms/SectionDeleteForm";
import { SectionEditForm } from "./forms/SectionEditForm";
import { ItemEditForm } from "./forms/ItemEditForm";
import { ItemDeleteForm } from "./forms/ItemDeleteForm";
import { ItemAddForm } from "./forms/ItemAddForm";
import adminModeStore from "../utils/adminModeStore";
interface MenuSectionProps {
  menuSection: MenuSection;
  handleAddToCart: (item: { name: string }) => void;
}

export const MenuSection = ({
  menuSection,
  handleAddToCart,
}: MenuSectionProps) => {
  const { openDialog } = useDialog();
  const isAdmin = adminModeStore((state) => state.isAdmin);

  const handleSectionEdit = () => {
    openDialog({
      title: "Edit Menu Section",
      content: <SectionEditForm section={menuSection} />,
    });
  };

  const handleItemEdit = (item: MenuItem) => {
    openDialog({
      title: "Edit Menu Item",
      content: <ItemEditForm item={item} />,
    });
  };

  const handleSectionDelete = () => {
    openDialog({
      title: "Delete Menu Section",
      content: <SectionDeleteForm sectionId={menuSection.id} />,
    });
  };

  const handleItemDelete = (itemId: number) => {
    openDialog({
      title: "Delete Menu Item",
      content: <ItemDeleteForm itemId={itemId} />,
    });
  };

  const handleItemAdd = (sectionId: number) => {
    openDialog({
      title: "Add Menu Item",
      content: <ItemAddForm sectionId={sectionId} />,
    });
  };

  return (
    <div id = {menuSection.name} className="relative flex flex-col">
      <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">
        {menuSection.name}
      </h2>
      {isAdmin && (
        <div className="absolute top-10 right-[-4rem]">
          <button
            onClick={handleSectionEdit}
            className="hover:scale-110 hover:bg-gray-200 rounded-full p-0.5"
          >
            <FiEdit3 size={28} />
          </button>
          <button
            onClick={handleSectionDelete}
            className="hover:scale-110 hover:bg-gray-200 rounded-full p-0.5"
          >
            <TbTrash size={28} />
          </button>
        </div>
      )}
      <hr className="bg-black border-black h-0.5"></hr>
      <img
        className="object-contain self-center float-left mt-1 w-96 mb-2"
        src={menuSection.imageUrl}
        alt={menuSection.imageAltText}
      />
      {isAdmin && (
        <button
          onClick={() => handleItemAdd(menuSection.id)}
          className="text-white bg-lime-700 hover:bg-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 self-start"
        >
          Add Menu Item
        </button>
      )}
      {menuSection.items.map((item: MenuItem) => (
        <article key={item.id} className="my-2 relative">
          <p className="text-left w-3/6 self-center inline-block font-semibold">
            {item.name}
          </p>
          <p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">
            ${item.price}
          </p>
          <button
            className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full"
            onClick={() => handleAddToCart(item)}
          >
            Add to Cart
          </button>
          {isAdmin && (
            <div className="absolute right-[-3.5rem] bottom-[-5px]">
              <button
                onClick={() => handleItemEdit(item)}
                className="hover:scale-110 hover:bg-gray-200 rounded-full p-0.5"
              >
                <FiEdit3 size={28} />
              </button>
              <button
                onClick={() => handleItemDelete(item.id)}
                className="hover:scale-110 hover:bg-gray-200 rounded-full p-0.5"
              >
                <TbTrash size={28} />
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
};
