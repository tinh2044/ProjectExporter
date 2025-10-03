import Form from "./pages/FormPage";
import { createBrowserRouter } from "react-router";
import HomeLayout from "./components/Home/HomeLayout";
import Home from "./pages/HomePage";
import FullForm from "./pages/FullFormPage";
import ProjectFormLayout from "./components/ProjectFrom/ProjectFormLayout";
import ProjectForm from "./pages/ProjectFormPage";

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
    element: <ProjectFormLayout />,
    children: [
      {
        path: "/forms/:id",
        element: <ProjectForm />,
      },
    ],
  },
  {
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <FullForm />,
      },
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);

export default routes;
