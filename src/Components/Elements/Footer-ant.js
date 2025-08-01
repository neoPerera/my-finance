import React from "react";
import { Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";
import "./Footer-ant.css";

const { Header, Content, Footer, Sider } = Layout;

const FooterAnt = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  return (
    <Footer className="custom-footer">
      <div className="footer-content">
        <div className="footer-brand">
          Made with love by
          <Link
            to="https://www.chanuthperera.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            NEO Design
          </Link>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} MyFinance. All rights reserved.
        </div>
      </div>
    </Footer>
  );
};

export default FooterAnt;
