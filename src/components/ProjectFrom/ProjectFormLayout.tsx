import { Layout } from "antd";
import { Outlet } from "react-router";
const { Header, Content, Footer } = Layout;


const ProjectFormLayout = () => {
  return (
    <Layout className="!min-h-screen flex flex-col">
      <Header></Header>
      <Content>
        <Outlet />
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default ProjectFormLayout;
