import React from "react";
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
  UploadOutlined,
} from "@ant-design/icons";

import { Layout, Button, theme, Dropdown, Row, Col } from "antd";
import FooterAnt from "./Footer-ant";

const { Header } = Layout;

const HeaderAnt = ({ collapsed, setCollapsed, MenuItemClicked }) => {
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
