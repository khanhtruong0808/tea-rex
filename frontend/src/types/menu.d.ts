interface MenuItem {
  id: number;
  price: number;
  name: string;
  menuSectionId: number;
  menuType: "food" | "beverage";
}
interface MenuSection {
  id: number;
  name: string;
  menuType: "food" | "beverage";
  imageUrl: string;
  imageAltText: string;
  items: MenuItem[];
}

type CartItem = {
  id: number,
  item: MenuItem;
  option: Item[];
  specialInstructions;
  quantity: number;
  spice?: Item;
};
