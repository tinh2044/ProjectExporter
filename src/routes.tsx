import { createBrowserRouter } from "react-router";
import HomeLayout from "./components/Home/HomeLayout";
import FullForm from "./pages/FullFormPage";
import DuAnManagementPage from "./pages/DuAnManagementPage";

const routes = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <FullForm />,
      },
    ],
  },
  {
    element: <DuAnManagementPage />,
    path: "/dashboard",
  },
]);

export default routes;
