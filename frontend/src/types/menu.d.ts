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
  id: string;
  item: MenuItem;
  option: Item[];
  specialInstructions;
  quantity: number;
  spice?: Item;
};

interface account {
  id: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}
