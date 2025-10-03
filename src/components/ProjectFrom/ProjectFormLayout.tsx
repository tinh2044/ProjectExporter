import { Layout } from "antd";
import { Outlet } from "react-router";
const { Content } = Layout;

const ProjectFormLayout = () => {
  return (
    <Layout className="!min-h-screen flex flex-col">
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default ProjectFormLayout;
