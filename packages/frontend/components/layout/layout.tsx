import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BankOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, Row } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { navs, SideNav } from "../../lib/constant/routes";
import apiService from "../../lib/services/api-service";
import storage from "../../lib/services/storage";
import { generateKey, getActiveKey } from "../../lib/util";
// import AppBreadcrumb from "../breadcrumb";

const { Header, Content, Sider } = Layout;

function UserIcon() {
  const router = useRouter();
  const onLogout = async () => {
    const { data: isLogout } = await apiService.logout();

    if (isLogout) {
      storage.deleteUserInfo();
      router.push("/login");
    }
  };

  return (
    <span
      style={{
        fontSize: 18,
        color: "#fff",
        cursor: "pointer",
        transition: "color 0.3s",
        marginLeft: "2em",
      }}
    >
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item onClick={onLogout}>
              <LogoutOutlined />
              <span>Logout</span>
            </Menu.Item>
          </Menu>
        }
        placement="bottomLeft"
      >
        <Avatar icon={<UserOutlined />} />
      </Dropdown>
    </span>
  );
}

const getMenuConfig = (data: SideNav[]): { defaultSelectedKeys: string[]; defaultOpenKeys: string[] } => {
  const key = getActiveKey(data);
  const defaultSelectedKeys = [key.split("/").pop()];
  const defaultOpenKeys = key.split("/").slice(0, -1);

  return { defaultSelectedKeys, defaultOpenKeys };
};

function renderMenuItems(data: SideNav[], parent = ""): JSX.Element[] {
  return data.map((item, index) => {
    const key = generateKey(item, index);

    if (item.subNav && !!item.subNav.length) {
      return (
        <Menu.SubMenu key={key} title={item.label} icon={item.icon}>
          {renderMenuItems(item.subNav, item.path.join("/"))}
        </Menu.SubMenu>
      );
    } else {
      return item.hide ? null : (
        <Menu.Item key={key} title={item.label} icon={item.icon}>
          {!!item.path.length || item.label.toLocaleLowerCase() === "overview" ? (
            <Link href={["/dashboard", parent, ...item.path].filter(item => !!item).join("/")} replace>
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </Menu.Item>
      );
    }
  });
}

export default function AppLayout(props: React.PropsWithChildren<any>) {
  const { children } = props;
  const [collapsed, toggleCollapse] = useState(false);
  const sideNave = navs;
  const menuItems = renderMenuItems(sideNave);
  const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNave);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={isCollapsed => toggleCollapse(isCollapsed)} width="300">
        <div
          style={{
            height: "64px",
            display: "inline-flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            color: "#fff",
            transform: "rotateX(45deg)",
            fontFamily: "monospace",
          }}
        >
          {collapsed ? (
            <BankOutlined />
          ) : (
            <Link href="/">
              <span style={{ color: "#fff", cursor: "pointer" }}>南头街道应急指挥中心</span>
            </Link>
          )}
        </div>
        <Menu theme="dark" mode="inline" defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
          {menuItems}
        </Menu>
      </Sider>

      <Layout id="contentLayout">
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: "0",
            zIndex: "10",
          }}
        >
          <span
            onClick={() => toggleCollapse(!collapsed)}
            style={{
              fontSize: 18,
              color: "#fff",
              cursor: "pointer",
              transition: "color 0.3s",
              marginLeft: "2em",
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>

          <Row align="middle">
            <UserIcon />
          </Row>
        </Header>

        <Content
          style={{
            margin: "16px",
            backgroundColor: "#fff",
            padding: "16px",
            minHeight: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
