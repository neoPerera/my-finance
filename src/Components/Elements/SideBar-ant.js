import React from "react";
import {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TransactionOutlined
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
const {  Sider } = Layout;
const SideBarAnt = ({ collapsed, MenuItemClicked }) => {

  return (
    <Sider collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        // defaultSelectedKeys={["1"]}
        onClick={MenuItemClicked}
        items={[
          {
            key: "1",
            icon: <DashboardOutlined />,
            label: "DashBoard",
            link: "/home"
          },
          {
            key: "2",
            icon: <TransactionOutlined />,
            label: "Transaction",
            link: "/home/transaction-add"
          },
          {
            label: "Reference",
            children:[
              {
                key: "3",
                icon: <BookOutlined />,
                label: "Income Master",
                link: "/home/ref-income"
              },
              {
                key: "4",
                icon: <BookOutlined />,
                label: "Expense Master",
                link: "/home/ref-expense"
              },
              
            ]
          },
          // {
          //   key: "99",
          //   icon: <LogoutOutlined />,
          //   label: "Logout",
          //   link: "/logout"
          // },
        ]}
      />
    </Sider>
  );
};
export default SideBarAnt;
