import { NavLink } from "react-router-dom";

const Sidebar = () => {
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
    <div className="h-24 flex justify-center items-center gap-32 bg-gradient-to-bl from-amber-600 to-amber-500">
      <NavLink to="/"></NavLink>
      <ul className="flex gap-12">
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
        className="text-2xl bg-lime-700 text-white font-bold rounded-full px-6 py-3 hover:scale-110 transition"
      >
        ORDER NOW
      </NavLink>
    </div>
  );
};
export default Sidebar;
