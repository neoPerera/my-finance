import React, { useState } from "react";
import { LockOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Typography,
  Spin,
  message,
  Alert,
} from "antd";
import FooterAnt from "../Elements/Footer-ant";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const { Title, Text } = Typography;

const LogIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleLogin = async () => {
    // Validate form
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }

    try {
      setSpinning(true);
      
      const response = await axios.post(
        `${window.env?.REACT_APP_API_URL}main/login`,
        {
          username: username,
          password: password,
        }
      );

      console.log(response.data);
      if (response.data.message === "Login successful") {
        messageApi.open({
          type: "success",
          content: "Login successful! Redirecting...",
          onClose: () => {
            localStorage.setItem("jwt_token", response.data.token);
            localStorage.setItem("username", username);
            const currentTime = new Date().getTime();
            localStorage.setItem("lastLoginTime", currentTime.toString());
            navigate("/home");
          },
        });
      }
    } catch (error) {
      setSpinning(false);
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid username or password.";
      } else if (error.response?.status === 0 || error.code === "NETWORK_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      }
      
      messageApi.open({
        type: "error",
        content: errorMessage,
        duration: 4,
      });
    } finally {
      setSpinning(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      {contextHolder}
      <Spin spinning={spinning} fullscreen />
      
      <div className="login-card">
        {/* Logo Section */}
        <div className="login-logo">
          <div className="logo-icon">
            <BookOutlined />
          </div>
          <Title level={2} className="login-title">
            MyFinance
          </Title>
          <Text className="login-subtitle">
            Welcome back! Please sign in to your account.
          </Text>
        </div>

        {/* Login Form */}
        <Form
          form={form}
          name="login_form"
          className="login-form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter your username!",
              },
              {
                min: 3,
                message: "Username must be at least 3 characters!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              onClick={handleLogin}
              loading={spinning}
              disabled={spinning || !username || !password}
            >
              {spinning ? "Signing In..." : "Sign In"}
            </Button>
          </Form.Item>
        </Form>

        {/* Additional Info */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
            Secure login powered by MyFinance
          </Text>
        </div>
      </div>

      {/* Footer */}
      <div className="login-footer">
        <FooterAnt />
      </div>
    </div>
  );
};

export default LogIn;
