import { ConfigProvider } from "antd";
import routes from "./routes";
import { RouterProvider } from "react-router";
import { AppMessageProvider } from "./contexts/AppMessage";

function App() {
  return (
    <ConfigProvider>
      <AppMessageProvider>
        <RouterProvider router={routes} />
      </AppMessageProvider>
    </ConfigProvider>
  );
}

export default App;
