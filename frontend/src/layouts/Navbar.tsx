import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

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
    { path: "/admin"}
  ];
  return (
    <nav
      className={`min-h-24 flex ${
        isExpanded
          ? "flex-col lg:flex-row items-start gap-2 pb-4 lg:pb-0"
          : "flex-row"
      } justify-between lg:justify-evenly 2xl:justify-center lg:items-center 2xl:gap-32 bg-gradient-to-bl from-amber-600 to-amber-500 lg:px-0 pl-1 pr-8`}
    >
      <NavLink to="/" className="shrink-0">
        <img src="tea-rex-sign.png" alt="" className="max-h-24" />
      </NavLink>
      <ul
        className={`${
          isExpanded ? "flex" : "hidden lg:flex"
        } pl-4 lg:pl-0 flex-col lg:flex-row gap-2 lg:gap-9 xl:gap-12`}
      >
        {routes.map((route) => (
          <NavLink to={route.path} key={route.name}>
            <li className="hover:text-amber-100 duration-300 font-bold text-3xl hover:scale-110 transition font-navbar">
              {route.name}
            </li>
          </NavLink>
        ))}
      </ul>
      <NavLink
        to="/menu"
        className={`${
          isExpanded ? "block" : "hidden"
        } text-2xl bg-lime-700 text-white font-bold rounded-full ml-2 px-4 py-2 lg:ml-0 lg:px-6 lg:py-3 hover:scale-110 transition lg:block`}
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
