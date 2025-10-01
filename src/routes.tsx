import Form from "./pages/Form";
import { createBrowserRouter } from "react-router";
import HomeLayout from "./components/Home/HomeLayout";
// import Home from "./pages/Home";
import FullForm from "./pages/FullForm";

const routes = createBrowserRouter([
  // {
  //   element: <HomeLayout />,
  //   children: [
  //     {
  //       path: "/",
  //       element: <Home />,
  //     },
  //   ],
  // },
  {
    path: "/form/:id",
    element: <Form />,
  },
  {
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <FullForm />,
      },
    ],
  },
]);

export default routes;
