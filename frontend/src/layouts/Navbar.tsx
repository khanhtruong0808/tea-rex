import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

const routes = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Rewards",
    path: "/rewards",
  },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact Us", path: "/contact" },
];

export const Navbar = () => {
  return (
    <Disclosure
      as="nav"
      className="bg-gradient-to-bl from-amber-600 to-amber-500 sticky left-0 right-0 top-0 z-20"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 lg:px-5 xl:px-8">
            <div className="flex h-16 md:h-20 xl:h-24 items-center justify-between">
              <div className="flex items-center">
                <NavLink reloadDocument to="/" className="shrink-0">
                  <img
                    src="tea-rex-sign.png"
                    alt=""
                    className="h-12 md:h-16 lg:h-20 xl:h-24"
                  />
                </NavLink>
              </div>
              <div className="hidden md:block">
                <div className="flex gap-2 md:flex-row md:gap-4 md:pl-0 xl:gap-12">
                  {routes.map((route) => (
                    <NavLink
                      to={route.path}
                      key={route.name}
                      reloadDocument
                      className="font-navbar text-2xl xl:text-3xl font-bold transition duration-300 hover:scale-110 hover:text-amber-100"
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
                    reloadDocument
                    className="block rounded-full bg-lime-700 px-4 py-2 text-xl font-bold text-white transition hover:scale-110 xl:block xl:px-6 xl:py-3"
                  >
                    ORDER NOW
                  </NavLink>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none focus:ring-0 focus:ring-inset">
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
                  key={route.name}
                  reloadDocument
                  className="font-navbar block rounded-md px-3 text-2xl font-bold hover:text-white hover:bg-lime-700"
                >
                  {route.name}
                </NavLink>
              ))}
              <div className="py-1"></div>
              <NavLink
                to="/menu"
                reloadDocument
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
