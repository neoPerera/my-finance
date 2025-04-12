import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Layout,
  Row,
  Col,
  Typography,
  Spin,
  message,
} from "antd";
import FooterAnt from "../Elements/Footer-ant";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;

const LogIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [loading, setLoading] = useState(false); // State for loading spinner
  const [spinning, setSpinning] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleLogin = async () => {
    try {
      setSpinning(true); // Start loading
      // Swal.fire({
      //   title: "Loading",
      //   timerProgressBar: true,
      //   didOpen: () => {
      //     Swal.showLoading();
      //   },
      // });

      const response = await axios.post(
        `${window.env?.REACT_APP_API_URL}api/login`,
        {
          username: username,
          password: password,
        }
      );

      // Handle the response as needed, e.g., redirect to another page on success
      console.log(response.data);
      if (response.data.message === "Login successful") {
        // Set a value in local storage
        messageApi.open({
          type: "success",
          content: "Login successful",
          onClose: () => {
            // setSpinning(false);

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
      messageApi.open({
        type: "error",
        content: "Something went wrong !",
      });
    } finally {
      // setSpinning(false); // Stop loading, whether successful or not
    }
  };

  return (
    <div>
      {contextHolder}
      <Spin spinning={spinning} fullscreen />
      <Layout style={{ height: "90vh" }}>
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={20} sm={12} md={8} lg={6} xl={4}>
            <Content
              style={{
                padding: 24,
                minHeight: 280,
                background: "#fff",
                borderRadius: "8px",
              }}
            >
              <Typography.Title
                level={3}
                style={{ textAlign: "center", marginBottom: 24 }}
              >
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
                    disabled={spinning}
                  >
                    Log in
                  </Button>
                </Form.Item>
              </Form>
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
