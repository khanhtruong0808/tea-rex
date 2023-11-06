import { NavLink } from "react-router-dom";
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
    <div className="sticky left-0 right-0 top-0 z-20 bg-gradient-to-bl from-amber-600 to-amber-500">
      <div>
        <div className="container mx-auto grid pt-10 sm:grid-cols-2 md:grid-cols-4">
          {footInfo.map((footInfo) => (
            <div
              key={footInfo.name}
              className="justify-left flex break-after-column gap-1 pl-5 sm:block lg:justify-center lg:pl-20 xl:h-20"
            >
              <p className="text-xl font-semibold sm:p-0">{footInfo.name}</p>
              <p className="py-1 sm:py-0">{footInfo.hours}</p>
              <p className="py-1 sm:py-0">{footInfo.phone}</p>
              <p className="py-1 sm:py-0">{footInfo.location}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 py-1 lg:h-1">
        {footIcons.map((footIcons) => (
          <NavLink
            to={footIcons.path}
            key={footIcons.name}
            aria-label={footIcons.name}
            className="flex gap-6"
          >
            <div className="flex rounded-full bg-lime-700 px-2 py-2 text-2xl font-bold text-white transition hover:scale-125">
              {footIcons.icon}
            </div>
          </NavLink>
        ))}
      </div>
      <div className="mx-2 flex justify-end gap-1">
        <p className="pt-1">
          <AiOutlineCopyrightCircle />
        </p>
        <p>2023 Tea Rex</p>
      </div>
    </div>
  );
};
export default Footer;
