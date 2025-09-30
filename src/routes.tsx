import Home from "./pages/Home";
import Form from "./pages/Form";
import { createBrowserRouter } from "react-router";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/form/:id",
    element: <Form />,
  },
]);

export default routes;