import { ReactNode } from "react";
import { useState } from "react";
import { Anchor} from 'antd'; // snaps, no text color

const { Link } = Anchor;

const SidebarMenu = ({menuSections}:any) => {
  const [open, setOpen] = useState(true); //for toggle, not implemented yet
  //place holder icons
  console.log(menuSections)
  return (
    <div className={`sidebar-container`}>
      <div className="fixed top-[7rem] left-0 h-full w-30 m-0 flex flex-col bg-amber-500 text-white shadow-lg gap-10 p-4 rounded-full cursor-pointer" style={{ height: "50vh", justifyContent:"center" }}>
      <Anchor style={{marginTop: "irem"}}>
      {menuSections.map((menuSection:any)=> <Link key ={menuSection.name} href = {`#${menuSection.name}`} title = {`${menuSection.name}`}/>)}
      </Anchor>
      </div>
    </div>
  );
};

const SidebarIcon = ({ string }: { string:ReactNode }) => (
  <div className="sidebar-icon group:">{string}</div>
);

export default SidebarMenu;
