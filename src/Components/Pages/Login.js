import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Layout, Row, Col, Typography } from "antd";
import FooterAnt from "../Elements/Footer-ant";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;

const LogIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loading spinner

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleLogin = async () => {
    try {
      setLoading(true); // Start loading
      Swal.fire({
        title: "Loading",
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/login`, {
        username: username,
        password: password,
      });

      // Handle the response as needed, e.g., redirect to another page on success
      console.log(response.data);
      if (response.data.message === "Login successful") {
        // Set a value in local storage
        Swal.fire({
          title: "Log in successful!",
          icon: "success"
        });
        localStorage.setItem("jwt_token", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    } finally {
      setLoading(false); // Stop loading, whether successful or not
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Content
            style={{
              padding: 24,
              minHeight: 280,
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Typography.Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
              My Finance
            </Typography.Title>

            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Content>
        </Col>
      </Row>
      <FooterAnt />
    </Layout>
  );
};

export default LogIn;
