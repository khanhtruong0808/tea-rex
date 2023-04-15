interface MenuItem {
  id: number;
  price: number;
  name: string;
  menuSectionId: number;
}
interface MenuSection {
  id: number;
  name: string;
  imageUrl: string;
  imageAltText: string;
  items: MenuItem[];
}
