import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

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
  return (
    <nav
      className={`min-h-24 flex ${
        isExpanded
          ? "flex-col items-start gap-2 pb-4 lg:flex-row lg:pb-0"
          : "flex-row"
      } sticky top-0 z-50 justify-between bg-gradient-to-bl from-amber-600 to-amber-500 pl-1 pr-8 lg:items-center lg:justify-evenly lg:px-0 2xl:justify-center 2xl:gap-32`}
    >
      <NavLink to="/" className="shrink-0">
        <img src="tea-rex-sign.png" alt="" className="max-h-24" />
      </NavLink>
      <ul
        className={`${
          isExpanded ? "flex" : "hidden lg:flex"
        } flex-col gap-2 pl-4 lg:flex-row lg:gap-9 lg:pl-0 xl:gap-12`}
      >
        {routes.map((route) => (
          <NavLink to={route.path} key={route.name}>
            <li className="font-navbar text-3xl font-bold transition duration-300 hover:scale-110 hover:text-amber-100">
              {route.name}
            </li>
          </NavLink>
        ))}
      </ul>
      <NavLink
        to="/cart"
        className="rounded-full bg-lime-700 px-3 py-3 text-3xl font-bold text-white transition hover:scale-110"
      >
        <FaShoppingCart />
      </NavLink>
      <NavLink
        to="/menu"
        className={`${
          isExpanded ? "block" : "hidden"
        } ml-2 rounded-full bg-lime-700 px-4 py-2 text-2xl font-bold text-white transition hover:scale-110 lg:ml-0 lg:block lg:px-6 lg:py-3`}
      >
        ORDER NOW
      </NavLink>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute right-5 top-8 lg:hidden"
      >
        {isExpanded ? <AiOutlineClose size={30} /> : <FaBars size={30} />}
      </button>
    </nav>
  );
};
export default Navbar;
