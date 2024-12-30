import { Link, Outlet, useLocation } from "react-router";

import { Layout, Menu, type MenuProps } from "antd";
import { pages } from "@/config/constant";

const { Header, Content, Sider } = Layout;

const items: MenuProps["items"] = [
  { name: "🏠 Home", path: "/" },
  ...pages,
].map(({ name, path }) => ({
  key: path,
  label: (
    <Link className="capitalize" to={path}>
      {name}
    </Link>
  ),
}));

const BaseLayout = () => {
  const { pathname } = useLocation();

  return (
    <Layout className="min-h-screen overflow-hidden">
      <Header className="text-white px-4">
        <span className="text-lg font-bold">Reusable React Query</span>
      </Header>

      <Content>
        <Layout className="h-[calc(100vh-64px)]">
          <Sider className="h-full bg-white">
            <Menu
              mode="inline"
              defaultSelectedKeys={["/"]}
              selectedKeys={[pathname || "/"]}
              items={items}
            />
          </Sider>

          <Content className="h-full p-4 overflow-y-auto">
            <Outlet />
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default BaseLayout;
