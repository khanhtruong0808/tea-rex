interface MenuItem {
  id: number;
  price: number;
  name: string;
}
interface MenuSection {
  id: number;
  name: string;
  imageUrl: string;
  imageAltText: string;
  items: MenuItem[];
}
