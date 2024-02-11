import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TransactionOutlined,
  DeliveredProcedureOutlined,
  FastForwardOutlined
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Axios from "axios";
const { Sider } = Layout;
const SideBarAnt = ({ collapsed, MenuItemClicked }) => {
  const [responseData, setResponseData] = useState([]);
  const [formData, setFormData] = useState([]);
  const [spinning, setSpinning] = React.useState(false);
  const iconComponents = {
    BookOutlined,
    DashboardOutlined,
    LogoutOutlined,
    TransactionOutlined,
    DeliveredProcedureOutlined,
    FastForwardOutlined
    // Add more components as needed
  };

  useEffect(() => {
    const getForms = async () => {
      console.log("Getting Exp Seq");

      try {
        const response = await Axios.get(
          `${process.env.REACT_APP_API_URL}api/home/getForms`
        );

        // Assuming the fetched data is an array

        setResponseData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getForms();
  }, []);

  useEffect(() => {
    if (!responseData) {
      // Handle case where responseData is undefined
      return;
    }

    // Declare formattedData outside of the map function
    const formattedData = [];

    responseData.forEach((item, index) => {
      const formattedItem = {
        key: item.str_form_id,
        icon: item.str_icon
          ? React.createElement(iconComponents[item.str_icon])
          : null,
        label: item.str_form_name,
        link: item.str_link,
        // children: [],
      };

      if (item.str_menu_id) {
        const parent = formattedData.find(
          (parentItem) => parentItem.label === item.str_menu_id
        );

        if (parent) {
          parent.children.push(formattedItem);
        } else {
          const newParent = {
            key: index.toString(),
            label: item.str_menu_id,
            children: [formattedItem],
          };
          formattedData.push(newParent);
        }
      } else {
        formattedData.push(formattedItem);
      }
    });

    // Update the state with the formatted data
    setFormData(formattedData);
  }, [responseData]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      // style={{
      //   overflow: "auto",
      //   height: "100vh",
      //   position: "fixed",
      // }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        // defaultSelectedKeys={["1"]}
        onClick={MenuItemClicked}
        items={formData}
      />
    </Sider>
  );
};
export default SideBarAnt;
