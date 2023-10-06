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
  item: MenuItem;
  option: Item[];
  spice: Item;
  specialInstructions;
  quantity: number;
};
