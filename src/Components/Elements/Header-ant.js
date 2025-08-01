import React, { useEffect, useState } from "react";
import {
  LogoutOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  SettingOutlined,
  BellOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import { Layout, Button, theme, Dropdown, Row, Col, Badge, Typography, Avatar, Space, Breadcrumb } from "antd";
import FooterAnt from "./Footer-ant";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import "./Header-ant.css";

const { Header } = Layout;
const { Title, Text } = Typography;

const HeaderAnt = ({ collapsed, setCollapsed, MenuItemClicked }) => {
  const [socket, setSocket] = useState(null);
  const [notificationList, setNotificationList] = useState([]);
  const [mappedNotificationArray, setMappedNotificationArray] = useState([]);
  const [currentPageTitle, setCurrentPageTitle] = useState("Dashboard");
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("Administrator");
  const location = useLocation();

  // Get user info from localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem("username") || "User";
    setUserName(storedUserName);
  }, []);

  // Update page title based on current route
  useEffect(() => {
    const pathname = location.pathname;
    let title = "Dashboard";
    
    if (pathname.includes("/dashboard")) title = "Dashboard";
    else if (pathname.includes("/expense")) title = "Expense Management";
    else if (pathname.includes("/income")) title = "Income Management";
    else if (pathname.includes("/transaction")) title = "Transactions";
    else if (pathname.includes("/account")) title = "Account Management";
    else if (pathname.includes("/purchasing")) title = "Purchasing";
    else if (pathname.includes("/report")) title = "Reports";
    
    setCurrentPageTitle(title);
  }, [location.pathname]);

  //can re use . commenting temporarily
  // useEffect(() => {
  //   console.log(
  //     `Notification API ==>${process.env.REACT_APP_NOTIFICATION_API}`
  //   );
  //   let socket = io(process.env.REACT_APP_NOTIFICATION_API);
  //   socket.emit("join", { username: localStorage.getItem("username") });
  //   socket.on("notification", (props) => {
  //     console.log("Received notification");
  //     setNotificationList((items) => [...items, props]);
  //   });
  //   setSocket(socket);
  // }, []);

  useEffect(() => {
    const mappedNotifications = notificationList.map((item, index) => ({
      key: index.toString(),
      label: item.title, // Assuming the notification data has a title property
      // Add other properties as needed for your menu items
    }));
    setMappedNotificationArray(mappedNotifications);
  }, [notificationList]);

  const iconComponents = {
    LogoutOutlined,
    SettingOutlined,
    // Add more components as needed
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Log out",
      icon: <LogoutOutlined />,
      link: "/logout",
    },
  ];

  const notificationItems = mappedNotificationArray.length > 0 ? mappedNotificationArray : [
    {
      key: "no-notifications",
      label: "No new notifications",
      disabled: true,
    }
  ];

  const handleClick = () => {
    setCollapsed(!collapsed);
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === "logout") {
      MenuItemClicked({ item: { props: { link: "/logout" } } });
    }
    // Handle other menu items as needed
  };

  const getBreadcrumbItems = () => {
    const pathname = location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    
    const breadcrumbItems = [
      {
        title: <HomeOutlined />,
        href: '/home',
      }
    ];

    segments.forEach((segment, index) => {
      if (segment !== 'home') {
        breadcrumbItems.push({
          title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        });
      }
    });

    return breadcrumbItems;
  };

  return (
    <Header className="custom-header">
      <Row style={{ width: "100%" }}>
        {/* Toggle Button */}
        <Button
          className="toggle-button"
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={handleClick}
          aria-label="Toggle sidebar"
        />
        
        {/* Header Content */}
        <div className="header-content">
          {/* Title and Breadcrumb */}
          <div className="header-title-section">
            <Title level={3} className="page-title">
              {currentPageTitle}
            </Title>
            <Breadcrumb 
              items={getBreadcrumbItems()}
              separator={<span style={{ color: '#8c8c8c' }}>/</span>}
              className="header-breadcrumb"
            />
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Notification Button */}
            <Dropdown
              trigger={["click"]}
              menu={{
                items: notificationItems,
                onClick: MenuItemClicked,
              }}
              placement="bottomRight"
              onOpenChange={(open) => {
                if (!open) {
                  setMappedNotificationArray([]);
                  setNotificationList([]);
                }
              }}
            >
              <Button className="notification-button" aria-label="Notifications">
                <Badge size="small" count={mappedNotificationArray.length}>
                  <BellOutlined />
                </Badge>
              </Button>
            </Dropdown>

            {/* User Menu */}
            <Dropdown
              trigger={["click"]}
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <Button className="user-button" aria-label="User menu">
                <Space>
                  <Avatar 
                    size="small" 
                    style={{ 
                      backgroundColor: '#1890ff',
                      fontSize: '12px'
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <span className="user-name">{userName}</span>
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>
      </Row>
    </Header>
  );
};

export default HeaderAnt;
