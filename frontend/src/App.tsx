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

function App() {
  // See https://reactrouter.com/
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Error</h1>}>
        <Route path="/admin" element={<Login />} />
        <Route index element={<Home />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="*" element={<div>404</div>} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
