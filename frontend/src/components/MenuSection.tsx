interface MenuSectionProps {
  menuSection: MenuSection;
  handleAddToCart: (item: { name: string }) => void;
}

export const MenuSection = ({
  menuSection,
  handleAddToCart,
}: MenuSectionProps) => {
  return (
    <div className="w-9/12 mx-auto p-5 max-w-lg">
      <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">
        {menuSection.name}
      </h2>
      <hr className="bg-black border-black h-0.5"></hr>
      <img
        className="object-contain self-start float-left mt-1 w-96 mb-2"
        src={menuSection.imageUrl}
        alt={menuSection.imageAltText}
      />
      {menuSection.items.map((item: MenuItem) => (
        <article key={item.id} className="my-2">
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
        </article>
      ))}
    </div>
  );
};
