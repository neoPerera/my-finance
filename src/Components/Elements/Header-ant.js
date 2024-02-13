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
} from "@ant-design/icons";

import { Layout, Button, theme, Dropdown, Row, Col, Badge } from "antd";
import FooterAnt from "./Footer-ant";
import { io } from "socket.io-client";
const { Header } = Layout;

const HeaderAnt = ({ collapsed, setCollapsed, MenuItemClicked }) => {
  const [socket, setSocket] = useState(null);
  const [notificationList, setNotificationList] = useState([]);
  const [mappedNotificationArray, setMappedNotificationArray] = useState([]);
  useEffect(() => {
    console.log(
      `Notification API ==>${process.env.REACT_APP_NOTIFICATION_API}`
    );
    let socket = io(process.env.REACT_APP_NOTIFICATION_API);
    socket.emit("join", { username: localStorage.getItem("username") });
    socket.on("notification", (props) => {
      console.log("Received notification");
      setNotificationList((items) => [...items, props]);
    });
    setSocket(socket);
  }, []);

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
    // Add more components as needed
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    {
      key: "99",
      label: "Log out",
      icon: React.createElement(iconComponents["LogoutOutlined"]),
      link: "/logout",
    },
  ];

  const handleClick = () => {
    // Call setCollapsed function to update the state in the parent component
    setCollapsed(!collapsed);
  };

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        // position: "relative", // Ensure the container is positioned
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <Row style={{ width: "100%" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={handleClick}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <Col
          style={{
            position: "absolute",
            right: 65,
            top: 0, // Add top: 0 to align with the top of the container
          }}
        >
          <Dropdown
            trigger={["click"]}
            menu={{
              items: mappedNotificationArray,
              // onClick: MenuItemClicked,
            }}
            placement="topRight"
            onOpenChange={(open) => {
              console.log("Drop Down nots "+ open);
              if (!open) {
                // Dropdown is closed, execute your function here
                setMappedNotificationArray([]);
                setNotificationList([]);
              }
            }}
          >
            <Button
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                border: 0,
              }}
            >
              <Badge size="small" count={mappedNotificationArray.length}>
                <NotificationOutlined />
              </Badge>
            </Button>
          </Dropdown>
        </Col>

        <Col
          style={{
            position: "absolute",
            right: 0,
            top: 0, // Add top: 0 to align with the top of the container
          }}
        >
          <Dropdown
            trigger={["click"]}
            menu={{
              items,
              onClick: MenuItemClicked,
            }}
            placement="topRight"
          >
            <Button
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                border: 0,
              }}
            >
              <UserOutlined />
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderAnt;
