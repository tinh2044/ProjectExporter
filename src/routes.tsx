import { createBrowserRouter } from "react-router";
import HomeLayout from "./components/Home/HomeLayout";
import FullForm from "./pages/FullFormPage";
import HomePage from "./pages/HomePage";
import EditorLayout from "./components/Editor/EditorLayout";
import EditorPage from "./pages/EditorPage";

const routes = createBrowserRouter([
  {
    element: <EditorLayout />,
    children: [
      {
        path: "/editors/:id",
        element: <EditorPage />,
      },
    ],
  },
  {
    element: <HomeLayout />,
    children: [
      {
        path: "/full-form",
        element: <FullForm />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);

export default routes;
