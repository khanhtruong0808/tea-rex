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
    <div className="sticky top-28 whitespace-nowrap text-sm font-medium lg:text-xl xl:text-2xl">
      <Tab.Group>
        <Tab.List className="mx-auto mb-5 grid w-full grid-cols-2 rounded-lg bg-black/5 p-1 md:w-[320px] lg:w-[425px] xl:w-[500px]">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`${
                  selected
                    ? "bg-amber-400 text-amber-50"
                    : "text-black/80 hover:bg-amber-400/40 hover:text-white"
                } rounded-lg px-1 py-3 text-center text-3xl font-extrabold outline-amber-400`}
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
                    : "text-black/80 hover:bg-amber-400/40 hover:text-white"
                } rounded-lg px-1 py-3 text-center text-3xl font-extrabold outline-amber-400`}
              >
                Food
              </button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels className="rounded-lg bg-amber-400/90 p-2 md:p-3 lg:p-4">
          <button
            className={`${
              selectedCategory === "all"
                ? "bg-amber-500 text-amber-100"
                : "hover:bg-amber-500 hover:text-amber-100"
            } mb-1 w-full cursor-pointer rounded-lg px-3 py-2 text-left uppercase`}
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
                      ? "bg-amber-500 text-amber-100"
                      : "hover:bg-amber-500 hover:text-amber-100"
                  } cursor-pointer rounded-lg px-3 py-2 text-left uppercase`}
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
                      ? "bg-amber-500 text-amber-100"
                      : "hover:bg-amber-500 hover:text-amber-100"
                  } cursor-pointer rounded-lg px-3 py-2 text-left uppercase`}
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
          className="mr-2 mt-4 rounded-lg bg-lime-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-lime-800"
        >
          Add Menu Section
        </button>
      )}
    </div>
  );
};

export default SidebarMenu;
