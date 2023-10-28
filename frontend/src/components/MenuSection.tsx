import { TbTrash } from "react-icons/tb";
import { FiEdit3 } from "react-icons/fi";
import useDialog from "../utils/dialogStore";
import { SectionDeleteForm } from "./forms/SectionDeleteForm";
import { SectionEditForm } from "./forms/SectionEditForm";
import { ItemEditForm } from "./forms/ItemEditForm";
import { ItemDeleteForm } from "./forms/ItemDeleteForm";
import { ItemAddForm } from "./forms/ItemAddForm";
import adminModeStore from "../utils/adminModeStore";
import { MenuPhoto } from "./MenuPhoto";
interface MenuSectionProps {
  menuSection: MenuSection;
  handleAddToCart: (item: MenuItem) => void;
}

interface MenuItemProps {
  item: MenuItem;
  isAdmin: boolean;
  handleItemEdit: (item: MenuItem) => void;
  handleItemDelete: (itemId: number) => void;
  handleAddToCart: (item: MenuItem) => void;
}

const MenuItem = ({
  item,
  isAdmin,
  handleItemDelete,
  handleItemEdit,
  handleAddToCart,
}: MenuItemProps) => {
  return (
    <div className="group flex bg-white px-3 py-2 text-base sm:text-lg md:text-xl hover:bg-amber-400">
      <div
        className="flex cursor-pointer justify-between w-full"
        onClick={() => handleAddToCart(item)}
        key={item.id}
      >
        <p>{item.name}</p>
        <p>${item.price}</p>
      </div>
      {isAdmin && (
        <>
          <button
            onClick={() => handleItemEdit(item)}
            className="ml-4 mr-1 hover:scale-110"
          >
            <FiEdit3 size={24} />
          </button>
          <button
            onClick={() => handleItemDelete(item.id)}
            className="hover:scale-110"
          >
            <TbTrash size={24} />
          </button>
        </>
      )}
    </div>
  );
};

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
    <div
      key={menuSection.name}
      id={menuSection.name}
      className="flex w-full flex-col"
    >
      <div className="align-center relative mb-8 flex flex-col gap-y-4 border-b border-amber-300 pb-8 px-2">
        <h2 className="text-center font-menu text-5xl sm:text-6xl font-bold uppercase">
          {isAdmin && (
            <div className="absolute bottom-0">
              <button
                onClick={handleSectionEdit}
                className="rounded-full p-0.5 hover:scale-110"
              >
                <FiEdit3 size={28} />
              </button>
              <button
                onClick={handleSectionDelete}
                className="rounded-full p-0.5 hover:scale-110"
              >
                <TbTrash size={28} />
              </button>
            </div>
          )}
          {menuSection.name}
        </h2>
        <div className="flex self-center">
          <img
            className="max-w-xs sm:max-w-sm self-center object-contain"
            src={menuSection.imageUrl}
            alt={menuSection.imageAltText}
          />
          {isAdmin && <MenuPhoto sectionId={menuSection.id} />}
        </div>
      </div>

      {isAdmin && (
        <div>
          <button
            onClick={() => handleItemAdd(menuSection.id)}
            className="mb-4 self-start rounded-lg bg-lime-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-lime-800"
          >
            Add Menu Item
          </button>
        </div>
      )}

      <div className="divide-y-2 divide-gray-100 overflow-hidden rounded-md ring-1 ring-gray-300">
        {menuSection.items.map((item: MenuItem) => (
          <MenuItem
            item={item}
            key={item.id}
            handleItemDelete={handleItemDelete}
            handleItemEdit={handleItemEdit}
            isAdmin={isAdmin}
            handleAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};
