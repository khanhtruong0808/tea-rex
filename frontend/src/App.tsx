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
import Rewards from "./pages/Rewards";
import Login from "./pages/Login";
import Registration from './pages/Registration';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

function App() {
  const queryClient = new QueryClient();

  // See https://reactrouter.com/
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Error</h1>}>
        <Route path="/admin" element={<Login />} />
        <Route path="/registration" element ={<Registration />} />
        <Route index element={<Home />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="*" element={<div>404</div>} />
      </Route>
    )
  );
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider router={router} />
    </QueryClientProvider>
    
  );
}

export default App;
