// import Footer from '../Elements/Footer';
// import NavBar from '../Elements/NavBar';
// import SideBar from '../Elements/SideBar';
// import NotFound from './404';
// import LogIn from './Login';
import DashBoard from "./SubPages/DashBoard";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import RefMasExpenseForm from "./SubPages/Reference/RefMasExpenseForm";
import RefMasExpenseList from "./SubPages/Reference/RefMasExpenseList";
import ProtectedRoute from "../Mechanisms/ProtectedRoute";
import RefMasIncomeList from "./SubPages/Reference/RefMasIncomeList";
import RefMasIncomeForm from "./SubPages/Reference/RefMasIncomeForm";
import TransactionForm from "./SubPages/Transaction/TransactionsForm";
import React, { useState } from "react";

import { Layout, theme } from "antd";
import SideBarAnt from "../Elements/SideBar-ant";
import HeaderAnt from "../Elements/Header-ant";
import FooterAnt from "../Elements/Footer-ant";
import { useNavigate, Link } from "react-router-dom";
import NotFound from "./404";
const { Content } = Layout;
const Home = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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
      <SideBarAnt collapsed={collapsed} MenuItemClicked={MenuItemClicked} />
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
          <Routes>
            <Route exact path="/" element={<DashBoard />} />
            <Route exact path="ref-expense" element={<RefMasExpenseList />} />
            <Route
              exact
              path="ref-expense/add"
              element={<RefMasExpenseForm />}
            />
            <Route exact path="ref-income" element={<RefMasIncomeList />} />
            <Route exact path="ref-income/add" element={<RefMasIncomeForm />} />
            {/* Transaction routes */}
            <Route exact path="transaction-add" element={<TransactionForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>
        <FooterAnt />
      </Layout>
    </Layout>
  );
};
export default Home;
