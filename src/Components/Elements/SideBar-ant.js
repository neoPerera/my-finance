import React from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
const {  Sider } = Layout;
const SideBarAnt = ({ collapsed, MenuItemClicked }) => {

  return (
    <Sider collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        // defaultSelectedKeys={["1"]}
        onClick={MenuItemClicked}
        items={[
          {
            key: "1",
            icon: <UserOutlined />,
            label: "DashBoard",
          },
          {
            key: "2",
            icon: <VideoCameraOutlined />,
            label: "Income Master",
          },
          {
            key: "3",
            icon: <UploadOutlined />,
            label: "Expense Master",
          },
        ]}
      />
    </Sider>
  );
};
export default SideBarAnt;
