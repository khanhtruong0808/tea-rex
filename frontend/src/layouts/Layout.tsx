import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "./Footer";
import { GlobalDialog } from "./GlobalDialog";
import { Navbar } from "./Navbar";
import { ShoppingCartProvider } from "../components/ShoppingCartProvider";
import { loadStripe } from "@stripe/stripe-js";
import { config } from "../config";
import { Elements } from "@stripe/react-stripe-js";
import { RewardsProvider } from "../components/RewardsProvider";
import { AlertProvider } from "../components/AlertMessageContext";

const stripePromise = loadStripe(config.stripePublicKey);

const Layout = () => {
  return (
    <div className="bg-gray-50">
      <Elements stripe={stripePromise}>
        <AlertProvider>
          <RewardsProvider>
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
          </RewardsProvider>
        </AlertProvider>
      </Elements>
    </div>
  );
};
export default Layout;
