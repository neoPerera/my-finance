// import Footer from '../Elements/Footer';
// import NavBar from '../Elements/NavBar';
// import SideBar from '../Elements/SideBar';
// import NotFound from './404';
// import LogIn from './Login';
import DashBoard from "./SubPages/DashBoard";
import Axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RefMasExpenseForm from "./SubPages/Reference/RefMasExpenseForm";
import RefMasExpenseList from "./SubPages/Reference/RefMasExpenseList";
import RefMasIncomeList from "./SubPages/Reference/RefMasIncomeList";
import RefMasIncomeForm from "./SubPages/Reference/RefMasIncomeForm";
import TransactionForm from "./SubPages/Transaction/TransactionsForm";
import { Layout, theme } from "antd";
import SideBarAnt from "../Elements/SideBar-ant";
import HeaderAnt from "../Elements/Header-ant";
import FooterAnt from "../Elements/Footer-ant";
import { useNavigate, Link } from "react-router-dom";
import NotFound from "./404";
import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TransactionOutlined,
  DeliveredProcedureOutlined,
  FastForwardOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const arrComponents = {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TransactionOutlined,
  DeliveredProcedureOutlined,
  FastForwardOutlined,
  DashBoard,
  RefMasExpenseList,
  RefMasExpenseForm,
  RefMasIncomeList,
  RefMasIncomeForm,
  TransactionForm,
  NotFound,
  // Add more components as needed
};

const Home = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [responseData, setResponseData] = useState([]);
  const [sideBarFormData, setSideBarFormFormData] = useState([]);
  const [spinning, setSpinning] = React.useState(false);
  const [routeList, setRouteList] = React.useState([]);

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
    console.log(`Response form lise ${responseData}`);
    // Declare formattedData outside of the map function
    const formattedData = [];
    const formattedRoutes = [];

    responseData.forEach((item, index) => {
      if (item.str_isMenu != "Y") {
        return;
      }
      const formattedItem = {
        key: item.str_form_id,
        icon: item.str_icon
          ? React.createElement(arrComponents[item.str_icon])
          : null,
        label: item.str_form_name,
        link: item.str_link,
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

    responseData.forEach((item, index) => {
      if (item.str_link == "/home") {
        return;
      }
      const formattedRouteItem = {
        path: item.str_link.replace(/^\/home/, ""),
        element: item.str_component,
      };

      formattedRoutes.push(formattedRouteItem);
    });

    // Update the state with the formatted data
    setSideBarFormFormData(formattedData);
    setRouteList(formattedRoutes);
  }, [responseData]);

  const navigate = useNavigate();
  const MenuItemClicked = ({ item, key, keyPath }) => {
    console.log("Menu ITEM CLICKED");
    console.log(item);
    console.log(key);
    console.log(keyPath);
    navigate(item.props.link);
    // if (key == "1") {
    //   navigate("/home");
    // } else if (key == "2") {
    //   navigate("/home/ref-income");
    // } else if (key == "3") {
    //   navigate("/home/ref-expense");
    // }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <SideBarAnt
        collapsed={collapsed}
        MenuItemClicked={MenuItemClicked}
        sideBarFormData={sideBarFormData}
      />
      <Layout
      // style={{ marginLeft: 80 }}
      >
        <HeaderAnt
          setCollapsed={setCollapsed}
          collapsed={collapsed}
          MenuItemClicked={MenuItemClicked}
        />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* DashBoard,RefMasExpenseList,RefMasExpenseForm,RefMasIncomeList,RefMasIncomeForm,TransactionForm */}
          <UserRoutes routeList={routeList} />
        </Content>
        <FooterAnt />
      </Layout>
    </Layout>
  );
};
const UserRoutes = ({ routeList }) => {
  console.log(`Formatted routes ${JSON.stringify(routeList)}`);

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={React.createElement(arrComponents["DashBoard"])}
      />
      {routeList.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={React.createElement(arrComponents[route.element])}
        />
      ))}
    </Routes>
  );
};

const UserRoutess = ({ routeList }) => {
  console.log(`Formatted routes ${routeList}`);
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={React.createElement(arrComponents["DashBoard"])}
      />
      <Route
        exact
        path="ref-expense"
        element={React.createElement(arrComponents["RefMasExpenseList"])}
      />
      <Route
        exact
        path="ref-expense/add"
        element={React.createElement(arrComponents["RefMasExpenseForm"])}
        // element={< />}
      />
      <Route
        exact
        path="ref-income"
        element={React.createElement(arrComponents["RefMasIncomeList"])}
      />
      <Route
        exact
        path="ref-income/add"
        element={React.createElement(arrComponents["RefMasIncomeForm"])}
      />
      {/* Transaction routes */}
      <Route
        exact
        path="transaction-add"
        element={React.createElement(arrComponents["TransactionForm"])}
      />
      <Route
        path="*"
        element={React.createElement(arrComponents["NotFound"])}
      />
    </Routes>
  );
};
export default Home;
