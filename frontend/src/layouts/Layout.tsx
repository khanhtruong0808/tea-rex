import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { GlobalDialog } from "./GlobalDialog";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
      <GlobalDialog />
    </>
  );
};
export default Layout;
