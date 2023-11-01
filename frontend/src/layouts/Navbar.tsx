import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { useShoppingCart } from "../components/ShoppingCartProvider";
import { FaShoppingCart } from "react-icons/fa";

const routes = [
  {
    name: "Home",
    path: "/",
  },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact Us", path: "/contact" },
  { name: "FAQ", path: "/FAQ" },
];

export const Navbar = () => {
  const { openCart, cartQuantity } = useShoppingCart();
  return (
    <Disclosure
      as="nav"
      className="sticky left-0 right-0 top-0 z-20 bg-gradient-to-bl from-amber-600 to-amber-500"
    >
      {({ open, close }) => (
        <>
          <div className="max-w-8xl mx-auto px-2 lg:px-5 xl:px-8">
            <div className="flex h-16 items-center justify-between md:h-20 xl:h-24">
              <div className="flex items-center">
                <NavLink to="/" className="shrink-0" onClick={() => close()}>
                  <img
                    src="tea-rex-sign.png"
                    alt=""
                    className="h-12 w-auto md:h-16 lg:h-20 xl:h-24"
                  />
                </NavLink>
              </div>
              <div className="hidden md:block">
                <div className="flex gap-2 md:flex-row md:gap-4 md:pl-0 xl:gap-12">
                  {routes.map((route) => (
                    <NavLink
                      to={route.path}
                      key={route.name}
                      className="font-navbar whitespace-nowrap text-2xl font-bold transition duration-300 hover:scale-110 hover:text-amber-100 xl:text-3xl"
                    >
                      {route.name}
                    </NavLink>
                  ))}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center">
                  <NavLink
                    to="/menu"
                    className="block whitespace-nowrap rounded-full bg-lime-700 px-4 py-2 text-xl font-bold text-white transition hover:scale-110 xl:block xl:px-6 xl:py-3"
                  >
                    ORDER NOW
                  </NavLink>
                </div>
              </div>

              <div className="flex items-center">
                <button className="relative" onClick={openCart}>
                  <FaShoppingCart className="mr-2 h-6 w-6 cursor-pointer rounded-lg text-black/70 hover:text-black md:h-8 md:w-8" />
                  {cartQuantity > 0 && (
                    <div className="absolute left-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-lime-700 text-sm text-white md:left-3.5 md:top-3.5 md:h-5 md:w-5">
                      {cartQuantity}
                    </div>
                  )}
                </button>
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none focus:ring-0 focus:ring-inset md:hidden">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-4 pt-2">
              {routes.map((route) => (
                <NavLink
                  to={route.path}
                  onClick={() => close()} // hack to close the menu on mobile
                  key={route.name}
                  preventScrollReset={true}
                  className="font-navbar block rounded-md px-3 text-2xl font-bold hover:bg-lime-700 hover:text-white"
                >
                  {route.name}
                </NavLink>
              ))}
              <div className="py-1"></div>
              <NavLink
                to="/menu"
                onClick={() => close()} // hack to close the menu on mobile
                className="rounded-full bg-lime-700 px-4 py-2 text-xl font-bold text-white hover:bg-lime-800"
              >
                ORDER NOW
              </NavLink>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
