import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Spin, Typography, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import FooterAnt from "../Elements/Footer-ant";

const { Content } = Layout;

const LogIn = () => {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const [popup, setPopup] = useState(null);

  const handleOpenLogin = () => {
    const externalLoginUrl = "https://login.chanuthperera.com/";
    const w = 500;
    const h = 700;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    
    const newPopup = window.open(
      externalLoginUrl,
      "ExternalLogin",
      `width=${w},height=${h},left=${left},top=${top}`
    );
    
    if (newPopup) {
      setPopup(newPopup);
      setWaiting(true);
    } else {
      message.error("Popup blocked. Please allow popups and try again.");
    }
  };

  useEffect(() => {
    if (!popup || !waiting) return;

    const externalLoginUrl = "https://login.chanuthperera.com/";
    const allowedOrigin = new URL(externalLoginUrl).origin;
    let received = false;

    const onMessage = (e) => {
      if (e.origin !== allowedOrigin) return;
      const data = e.data || {};
      if (data.type === "auth-success" && data.token) {
        received = true;
        localStorage.setItem("jwt_token", data.token);
        if (data.username) localStorage.setItem("username", data.username);
        localStorage.setItem("lastLoginTime", Date.now().toString());
        message.success("Login successful");
        try {
          if (popup && !popup.closed) popup.close();
        } catch (err) {}
        setWaiting(false);
        navigate("/");
      } else if (data.type === "auth-failure") {
        received = true;
        message.error(data.message || "Authentication failed");
        try {
          if (popup && !popup.closed) popup.close();
        } catch (err) {}
        setWaiting(false);
      }
    };

    window.addEventListener("message", onMessage);

    const timer = setInterval(() => {
      if (popup && popup.closed && !received) {
        clearInterval(timer);
        setWaiting(false);
        message.error("Login window closed before completing authentication.");
      }
    }, 500);

    return () => {
      window.removeEventListener("message", onMessage);
      clearInterval(timer);
    };
  }, [popup, waiting, navigate]);

  return (
    <div>
      <Layout style={{ height: "90vh" }}>
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col>
            <Content
              style={{
                padding: 24,
                minHeight: 280,
                background: "#fff",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              {waiting ? (
                <>
                  <Spin />
                  <Typography.Paragraph style={{ marginTop: 16 }}>
                    Waiting for login to complete...
                  </Typography.Paragraph>
                </>
              ) : (
                <>
                  <Typography.Title level={3} style={{ marginBottom: 24 }}>
                    My Finance
                  </Typography.Title>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleOpenLogin}
                    style={{ minWidth: 200 }}
                  >
                    Login
                  </Button>
                </>
              )}
            </Content>
          </Col>
        </Row>
        <div style={{ position: "relative", bottom: 95 }}>
          <FooterAnt />
        </div>
      </Layout>
    </div>
  );
};

export default LogIn;
