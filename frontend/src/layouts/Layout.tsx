import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { GlobalDialog } from "./GlobalDialog";

const Layout = () => {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />

      {/* Global dialog to be used across each page */}
      <GlobalDialog />
    </div>
  );
};
export default Layout;
