interface Props {
  menuSections: MenuSection[];
  selectedCategory: any;
  setSelectedCategory: (category: any) => void;
}

const SidebarMenu = ({
  menuSections,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col gap-y-4 lg:gap-y-6 xl:gap-y-8 whitespace-nowrap text-lg lg:text-xl xl:text-2xl font-medium">
      <h2 className="border-b border-amber-300 pb-4 text-4xl font-extrabold">
        Menu
      </h2>
      <p
        className={`${
          selectedCategory === "all" ? "text-amber-500" : "hover:text-amber-500"
        } cursor-pointer uppercase `}
        onClick={() => setSelectedCategory("all")}
      >
        View All
      </p>
      {menuSections.map((menuSection: MenuSection) => {
        const isSelected = menuSection.name === selectedCategory;
        return (
          <p
            className={`${
              isSelected ? "text-amber-500" : "hover:text-amber-500"
            } cursor-pointer uppercase`}
            key={menuSection.name}
            onClick={() => handleSelectCategory(menuSection.name)}
          >
            {menuSection.name}
          </p>
        );
      })}
    </div>
  );
};

export default SidebarMenu;
