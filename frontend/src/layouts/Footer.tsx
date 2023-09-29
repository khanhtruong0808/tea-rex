import { NavLink, Route } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaYelp } from "react-icons/fa";
import { FaTripadvisor } from "react-icons/fa";
import { FaUntappd } from "react-icons/fa";
import { AiOutlineCopyrightCircle } from "react-icons/ai";

const Footer = () => {
  const footInfo = [
    { name: "Business Hours:", hours: "Mon - Sun:	11:00 AM - 8:00 PM" },
    { name: "Carryout Hours:", hours: "Mon - Sun:	11:00 AM - 8:00 PM" },
    { name: "Contact Us:", phone: "(916) 896-1605" },
    {
      name: "Location:",
      location: "2475 Elk Grove Blvd #150, Elk Grove, CA 95758",
    },
  ];

  const footIcons = [
    {
      name: "Facebook",
      path: "https://www.facebook.com/TeaRexBobaTea/",
      icon: <FaFacebookF />,
    },
    {
      name: "Yelp",
      path: "https://www.yelp.com/biz/tea-rex-elk-grove",
      icon: <FaYelp />,
    },
    {
      name: "TripAdvisor",
      path: "https://www.tripadvisor.com/Restaurant_Review-g32349-d10493338-Reviews-Tea_Rex-Elk_Grove_California.html",
      icon: <FaTripadvisor />,
    },
    {
      name: "Untappd",
      path: "https://untappd.com/v/tea-rex/1791038",
      icon: <FaUntappd />,
    },
  ];
  return (
    <div className="h-64 gap-30 bg-gradient-to-bl from-amber-600 to-amber-500">
      <div>
        <ul className="display:flex; grid sm:grid-cols-2 md:grid-cols-4 sm:container sm:mx-auto h-48 pt-10">
          {footInfo.map((footInfo) => (
            <li
              key={footInfo.name}
              className="flex justify-center sm:block gap-1 break-after-column"
            >
              <p className="text-xl font-semibold">{footInfo.name}</p>
              <p>{footInfo.hours}</p>
              <p>{footInfo.phone}</p>
              <p>{footInfo.location}</p>
            </li>
          ))}
        </ul>
      </div>
      <ul className="flex justify-center items-center gap-6">
        {footIcons.map((footIcons) => (
          <NavLink
            to={footIcons.path}
            key={footIcons.name}
            className="flex gap-6"
          >
            <li className="flex text-2xl bg-lime-700 text-white font-bold rounded-full px-2 py-2 hover:scale-125 transition">
              {footIcons.icon}
            </li>
          </NavLink>
        ))}
      </ul>
      <ul className="flex justify-end gap-1 mx-2">
        <p>
          <AiOutlineCopyrightCircle />
        </p>
        <p>2023 Tea Rex</p>
      </ul>
    </div>
  );
};
export default Footer;
