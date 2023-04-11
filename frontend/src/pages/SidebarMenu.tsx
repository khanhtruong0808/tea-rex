import { ReactNode } from "react";
import { TfiMenu } from "react-icons/Tfi";
import { AiFillSetting } from "react-icons/Ai";
import { FaMapMarkedAlt } from "react-icons/Fa";
import { BsCalendar2CheckFill } from "react-icons/Bs";
import { useState } from "react";

const SidebarMenu = () => {
  const [open, setOpen] = useState(true); //for toggle, not implemented yet
  //place holder icons
  return (
    <div className={`sidebar-container`}>
      <div className="fixed top-[7rem] left-0 h-50 w-30 m-0 flex flex-col bg-amber-500 text-white shadow-lg gap-10 p-4 rounded-full cursor-pointer">
        <SidebarIcon icon={<TfiMenu size="42" />} />
        <SidebarIcon icon={<FaMapMarkedAlt size="30" />} />
        <SidebarIcon icon={<BsCalendar2CheckFill size="30" />} />
        <SidebarIcon icon={<AiFillSetting size="42" />} />
      </div>
    </div>
  );
};

//placeholder icons
const SidebarIcon = ({ icon }: { icon: ReactNode }) => (
  <div className="sidebar-icon group:">{icon}</div>
);

export default SidebarMenu;