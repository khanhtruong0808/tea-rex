import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { SectionAddForm } from "../components/forms/SectionAddForm";
import useDialog from "../utils/dialogStore";
import adminModeStore from "../utils/adminModeStore";

interface Props {
  menuSections: MenuSection[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const SidebarMenu = ({
  menuSections,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  const { openDialog } = useDialog();
  const [isAdmin] = adminModeStore((state) => [state.isAdmin]);
  const beverageMenuSections = menuSections.filter(
    (menuSection: MenuSection) => menuSection.menuType === "beverage",
  );
  const foodMenuSections = menuSections.filter(
    (menuSection: MenuSection) => menuSection.menuType === "food",
  );

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    window.scrollTo(0, 0);
  };

  const handleAddSection = () => {
    openDialog({
      title: "Add Menu Section",
      content: <SectionAddForm />,
    });
  };

  return (
    <div className="whitespace-nowrap text-sm lg:text-xl xl:text-2xl font-medium sticky top-28">
      <Tab.Group>
        <Tab.List className="grid grid-cols-2 rounded-lg p-1 mb-5 w-full md:w-[320px] lg:w-[425px] xl:w-[500px] bg-black/5 mx-auto">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`${
                  selected
                    ? "bg-amber-400 text-amber-50"
                    : "hover:bg-amber-400/40 hover:text-white text-black/80"
                } text-3xl font-extrabold py-3 px-1 text-center rounded-lg outline-amber-400`}
              >
                Drinks
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`${
                  selected
                    ? "bg-amber-400 text-amber-50"
                    : "hover:bg-amber-400/40 hover:text-white text-black/80"
                } text-3xl font-extrabold py-3 px-1 text-center rounded-lg outline-amber-400`}
              >
                Food
              </button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels className="bg-amber-400/90 rounded-lg p-2 md:p-3 lg:p-4">
          <button
            className={`${
              selectedCategory === "all"
                ? "text-amber-100 bg-amber-500"
                : "hover:text-amber-100 hover:bg-amber-500"
            } cursor-pointer uppercase mb-1 px-3 py-2 rounded-lg w-full text-left`}
            onClick={() => setSelectedCategory("all")}
          >
            View All
          </button>
          <Tab.Panel className="flex flex-col gap-y-1">
            {beverageMenuSections.map((menuSection: MenuSection) => {
              const isSelected = menuSection.name === selectedCategory;
              return (
                <button
                  className={`${
                    isSelected
                      ? "text-amber-100 bg-amber-500"
                      : "hover:text-amber-100 hover:bg-amber-500"
                  } cursor-pointer uppercase px-3 py-2 rounded-lg text-left`}
                  key={menuSection.name}
                  onClick={() => handleSelectCategory(menuSection.name)}
                >
                  {menuSection.name}
                </button>
              );
            })}
          </Tab.Panel>
          <Tab.Panel className="flex flex-col gap-y-1">
            {foodMenuSections.map((menuSection: MenuSection) => {
              const isSelected = menuSection.name === selectedCategory;
              return (
                <button
                  className={`${
                    isSelected
                      ? "text-amber-100 bg-amber-500"
                      : "hover:text-amber-100 hover:bg-amber-500"
                  } cursor-pointer uppercase px-3 py-2 rounded-lg text-left`}
                  key={menuSection.name}
                  onClick={() => handleSelectCategory(menuSection.name)}
                >
                  {menuSection.name}
                </button>
              );
            })}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      {isAdmin && (
        <button
          type="button"
          onClick={handleAddSection}
          className="mt-4 mr-2 rounded-lg bg-lime-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-lime-800"
        >
          Add Menu Section
        </button>
      )}
    </div>
  );
};

export default SidebarMenu;
