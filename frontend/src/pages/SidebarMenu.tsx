import { ReactNode } from "react";
import { useState } from "react";
import React from 'react';
import { Anchor} from 'antd';

const { Link } = Anchor;

const SidebarMenu = () => {
  const [open, setOpen] = useState(true); //for toggle, not implemented yet
  //place holder icons
  return (
    <div className={`sidebar-container`}>
      <div className="fixed top-[7rem] left-0 h-50 w-30 m-0 flex flex-col bg-amber-500 gap-10 p-4 rounded-full ">
      <Anchor>
        <Link href = "#Snack" title = "Snack"/>
        <Link href = "#Musubi" title = "Musubi"/>
        <Link href = "#Bento" title = "Bento Box"/>
        <Link href = "#Chowmein" title = "Chowmein"/>
        <Link href = "#Sushi" title = "Sushi"/>
        <Link href = "#PokeBowl" title = "PokeBowl"/>
        <Link href = "#Ramen" title = "Ramen"/>
        <Link href = "#Rice/Soup" title = "Rice/Soup"/>
        <Link href = "#Milk Tea" title = "Milk Tea"/>
        <Link href = "#Flavor Tea" title = "Flavor Tea"/>
        <Link href = "#Not So Secret" title = "Not So Secret"/>
        <Link href = "#Slushy" title = "Slushy"/>
        <Link href = "#Soda" title = "Soda"/>
        <Link href = "#Watermelon" title = "Watermelon"/>
        <Link href = "#Mojito" title = "Mojito"/>
        <Link href = "#Paradise" title = "Paradise"/>
        <Link href = "#Butterfly" title = "Butterfly"/>
        <Link href = "#Party" title = "Party"/>
      </Anchor>
      </div>
    </div>
  );
};

//placeholder icons
const SidebarIcon = ({ string }: { string:ReactNode }) => (
  <div className="sidebar-icon group:">{string}</div>
);

export default SidebarMenu;
