import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { GlobalDialog } from "./GlobalDialog";
import { Navbar } from "./Navbar";
import { ShoppingCartProvider } from "../components/ShoppingCartContext";

const Layout = () => {
  return (
    <div className="bg-gray-50">
      <ShoppingCartProvider>
        <Navbar />
        <div className="min-h-screen">
          <Outlet />
        </div>
        <Footer />

        {/* Global dialog to be used across each page */}
        <GlobalDialog />
      </ShoppingCartProvider>
      </div>
  );
};
export default Layout;
