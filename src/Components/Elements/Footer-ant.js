import React from "react";
import { Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

const FooterAnt = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Footer
      style={{
        textAlign: "center",
        // position: "relative",
        // bottom: 93
      }}
    >
      <Link
        to="https://www.chanuthperera.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        NEO Design
      </Link>
      ©{new Date().getFullYear()}
    </Footer>
  );
};
export default FooterAnt;
