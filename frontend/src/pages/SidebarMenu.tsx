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
    <div className="flex flex-col gap-y-8 overflow-auto whitespace-nowrap text-2xl">
      <h2 className="border-b border-amber-300 pb-4 text-4xl font-extrabold">
        Menu
      </h2>
      {menuSections.map((menuSection: MenuSection) => {
        const isSelected = menuSection.name === selectedCategory;
        return (
          <p
            className={`${
              isSelected ? "font-bold" : "hover:font-semibold"
            } cursor-pointer uppercase `}
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
