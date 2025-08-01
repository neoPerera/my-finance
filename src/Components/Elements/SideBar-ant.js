import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TransactionOutlined,
  DeliveredProcedureOutlined,
  FastForwardOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined
} from "@ant-design/icons";
import { Layout, Menu, theme, Avatar, Typography, Divider, Badge } from "antd";
import "./SideBar-ant.css";

const { Sider } = Layout;
const { Text } = Typography;

const SideBarAnt = ({ collapsed, MenuItemClicked, sideBarFormData }) => {
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("Administrator");

  useEffect(() => {
    // Get user info from localStorage or context
    const storedUserName = localStorage.getItem("username") || "User";
    setUserName(storedUserName);
  }, []);

  return (
    <Sider
      className="custom-sidebar"
      collapsible
      collapsed={collapsed}
      width={280}
      collapsedWidth={80}
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
      <div className="logo-section">
        <div className={`logo-container ${!collapsed ? 'expanded' : ''}`}>
          <div className="logo-icon">
            <BookOutlined />
          </div>
          <div className={`logo-text ${collapsed ? 'collapsed' : ''}`}>
            MyFinance
          </div>
        </div>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        onClick={MenuItemClicked}
        items={sideBarFormData}
        style={{
          flex: 1,
          border: 'none',
        }}
      />

      <div className="user-section">
        <div className="user-info">
          <Avatar 
            className="user-avatar" 
            icon={<UserOutlined />}
            size={36}
          />
          <div className={`user-details ${collapsed ? 'collapsed' : ''}`}>
            <div className="user-name">{userName}</div>
            <div className="user-role">{userRole}</div>
          </div>
        </div>
      </div>
    </Sider>
  );
};

export default SideBarAnt;
