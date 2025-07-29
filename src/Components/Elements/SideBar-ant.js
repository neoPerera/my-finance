import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TransactionOutlined,
  DeliveredProcedureOutlined,
  FastForwardOutlined
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
const { Sider } = Layout;
const SideBarAnt = ({ collapsed, MenuItemClicked,sideBarFormData }) => {
  

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      style={{
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        // defaultSelectedKeys={["1"]}
        onClick={MenuItemClicked}
        items={sideBarFormData}
      />
    </Sider>
  );
};
export default SideBarAnt;
