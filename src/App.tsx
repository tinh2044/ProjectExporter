import { ConfigProvider } from "antd";
import routes from "./routes";
import { RouterProvider } from "react-router";
import {AppMessageProvider} from "./contexts/AppMessage";
// import ToTrinhWordGenerator from "./pages/Sample";

function App() {
  return (
    <ConfigProvider
      
    >
      <AppMessageProvider>
        <RouterProvider router={routes} />
        {/* <ToTrinhWordGenerator /> */}
      </AppMessageProvider>
    </ConfigProvider>
  );
}

export default App;
