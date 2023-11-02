import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import PaymentResult from "./pages/PaymentResult";
import NotFound from "./pages/NotFound";
import Accounts from "./pages/Accounts";
import FAQPage from "./pages/FAQ"; // Import the FAQPage component
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RewardsProvider } from "./components/RewardsContext";

function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Error</h1>}>
        <Route path="/admin" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route index element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/account" element={<Accounts />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  );

  return (
    <RewardsProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </RewardsProvider>
  );
}

export default App;
