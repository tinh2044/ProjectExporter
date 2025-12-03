import { createBrowserRouter } from "react-router";
import HomeLayout from "./components/Home/HomeLayout";
import FullForm from "./pages/FullFormPage";
import DuAnManagementPage from "./pages/DuAnManagementPage";

const routes = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      {
        path: "/form",
        element: <FullForm />,
      },
    ],
  },
  {
    element: <DuAnManagementPage />,
    path: "/",
  },
]);

export default routes;
