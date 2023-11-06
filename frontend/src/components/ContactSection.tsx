import { MdEmail, MdLocalPhone, MdPlace } from "react-icons/md";
import ContactInfoItem from "./ContactInfo";

export default function ContactSection() {
  return (
    <div className="mx-auto p-6">
      <h1 className="font-menu mb-6 w-full border-b-2 border-black px-4 py-4 text-center text-6xl font-extrabold">
        Contact Us Here
      </h1>
      <div className="mx-auto flex flex-col justify-center space-y-6 lg:flex-row lg:justify-evenly lg:space-y-0">
        <ContactInfoItem
          icon={<MdLocalPhone className="text-xl text-white" />}
          text="+(916) 896-1605"
        />
        <ContactInfoItem
          icon={<MdEmail className="text-xl text-white" />}
          text="Tearexelkgrove@yahoo.com"
        />
        <ContactInfoItem
          icon={<MdPlace className="text-xl text-white" />}
          text="2475 Elk Grove Blvd #150, Elk Grove, CA 95758"
        />
      </div>
    </div>
  );
}
