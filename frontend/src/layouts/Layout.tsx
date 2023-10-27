import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "./Footer";
import { GlobalDialog } from "./GlobalDialog";
import { Navbar } from "./Navbar";
import { ShoppingCartProvider } from "../components/ShoppingCartProvider";
import { RewardsProvider } from "../components/RewardsContext";
import { loadStripe } from "@stripe/stripe-js";
import { config } from "../config";
import { Elements } from "@stripe/react-stripe-js";

const Layout = () => {
  const stripePromise = loadStripe(config.stripePublicKey);

  return (
    <div className="bg-gray-50">
      <Elements stripe={stripePromise}>
        <ShoppingCartProvider>
          <ScrollRestoration />
          <Navbar />
          <div className="min-h-screen">
            <Outlet />
          </div>
          <Footer />

          {/* Global dialog to be used across each page */}
          <GlobalDialog />
        </ShoppingCartProvider>
      </Elements>
    </div>
  );
};
export default Layout;
