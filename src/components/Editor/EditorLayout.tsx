import { Layout } from "antd";
import { Outlet } from "react-router";
const { Header, Content } = Layout;

const EditorLayout = () => {
  return (
    <Layout className="!min-h-screen flex flex-col">
      <Header></Header>
      <Layout className="flex-1">
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default EditorLayout;
