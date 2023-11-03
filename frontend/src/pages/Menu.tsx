import { useQuery } from "@tanstack/react-query";
import SidebarMenu from "./SidebarMenu";
import { useState, useEffect } from "react";
import { MenuSection } from "../components/MenuSection";
import { config } from "../config";
import useDialog from "../utils/dialogStore";
import adminModeStore from "../utils/adminModeStore";
import DeliveryOption from "../components/DeliveryOption";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { AddItemForm } from "../components/AddItemForm";

const Menu = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["menuSections"],
    queryFn: () =>
      fetch(config.baseApiUrl + "/menu-section").then((res) => res.json()),
  });

  const [isAdmin] = adminModeStore((state) => [state.isAdmin]);
  const openDialog = useDialog((state) => state.openDialog);
  const closeDialog = useDialog((state) => state.closeDialog);

  // category selected on sidebar
  const [selectedCategory, setSelectedCategory] = useState<string>("Milk Tea");

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      adminModeStore.setState({ isAdmin: true });
    }
  }, []);

  const [showLoading, setShowLoading] = useState(false);

  // Introduce a delay for showing the loading screen
  // Only display the loading screen if the data is not yet loaded
  // AND it has been loading for more than 4 seconds
  useEffect(() => {
    const loadingDelay = setTimeout(() => {
      setShowLoading(true);
    }, 4000); // Delay for 4 seconds

    // Cleanup the timeout to prevent memory leaks
    return () => {
      clearTimeout(loadingDelay);
    };
  }, []); // Empty dependency array to run the effect once

  if (showLoading && isLoading) {
    return (
      <div className="relative flex flex-col items-center justify-center">
        <img
          src="tearex.png"
          alt="tearex.png"
          className="ml-10 w-[40%] animate-pulse text-center" // Other classes can be used alongside inline styles
        />
        {/* MAKE GIF INSTEAD OF LAYERING TO MAKE SCREEN RESPONSIVE
        <div
          className="relative flex items-center justify-center animate-pulse"
          style={{
            top: "-375px",
            left: "-110px",
            transform: "rotate(-65deg)",
          }} // not mobile friendly yet
        >
          <PulseLoader
            color={"#000000"}
            loading={true} // Show loading screen for 4 seconds
            size={15}
            margin={15}
          />
        </div> */}
      </div>
    );
  }
  if (isLoading) return null;

  const handleLogout = () => {
    // Clear the admin mode state

    adminModeStore.setState({ isAdmin: false });
    localStorage.removeItem("token");
    fetch("/logout", {
      method: "GET",
    })
      .then((response) => {
        if (response.status === 200) {
          navigate("/Admin");
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // function when clicking add to cart button
  const handleAddToCart = (selectedItem: MenuItem) => {
    openDialog({
      title: "",
      content: <AddItemForm selectedItem={selectedItem} />,
      variant: "cart",
    });
  };

  const handleMobileSetSelectedCategory = (category: string) => {
    setSelectedCategory(category);
    closeDialog();
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1);
  };

  const handleOpenMobileMenu = () => {
    openDialog({
      title: "",
      content: (
        <SidebarMenu
          menuSections={data}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleMobileSetSelectedCategory}
        />
      ),
    });
  };

  return (
    <div className="flex gap-x-4 px-4 pb-20 pt-12 lg:px-6">
      <button
        className="fixed z-50 block rounded-full bg-lime-700 px-4 py-6 text-sm font-bold text-white shadow-md hover:bg-lime-800 md:hidden"
        onClick={handleOpenMobileMenu}
      >
        Menu
      </button>
      <div className="hidden md:block">
        <SidebarMenu
          menuSections={data}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div className="fixed pt-9 lg:px-40">
          <DeliveryOption />
        </div>
      </div>

      <div className="absolute right-2 top-28">
        <div className="flex flex-col">
          {isAdmin && (
            <div className="z-10">
              <div className="justify-center">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-md border-red-500 bg-red-500 px-5 py-1 text-white"
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-12">
        {selectedCategory === "all"
          ? data.map((menuSection: MenuSection) => (
              <MenuSection
                key={menuSection.id}
                menuSection={menuSection}
                handleAddToCart={handleAddToCart}
              />
            ))
          : data.find(
              (menuSection: MenuSection) =>
                menuSection.name === selectedCategory,
            ) && (
              <MenuSection
                menuSection={data.find(
                  (menuSection: MenuSection) =>
                    menuSection.name === selectedCategory,
                )}
                handleAddToCart={handleAddToCart}
              />
            )}
      </div>
    </div>
  );
};

export default Menu;
