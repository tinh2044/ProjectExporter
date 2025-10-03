import { Layout } from "antd";
import { Outlet } from "react-router";
const { Header, Content, Footer } = Layout;

const HomeLayout = () => {
  return (
    <Layout className="!min-h-screen flex flex-col">
      <Header></Header>
      <Layout className="flex-1">
        <Content>
          <Outlet />
        </Content>
      </Layout>
      <Footer></Footer>
    </Layout>
  );
};

export default HomeLayout;
