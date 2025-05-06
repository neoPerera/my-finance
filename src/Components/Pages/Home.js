import Axios from "axios";
import React, { useEffect, useState, Suspense } from "react";
import { Layout, Skeleton, theme } from "antd";
import {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TransactionOutlined,
  DeliveredProcedureOutlined,
  FastForwardOutlined,
  AccountBookOutlined
} from "@ant-design/icons";
import { useNavigate, Routes, Route } from "react-router-dom";

import SideBarAnt from "../Elements/SideBar-ant";
import HeaderAnt from "../Elements/Header-ant";
import FooterAnt from "../Elements/Footer-ant";
import NotFound from "./404";

const { Content } = Layout;

// === Lazy load micro frontends with fallback ===
const LazyWithFallback = (importFunc, fallback = null) =>
  React.lazy(() =>
    importFunc().catch((err) => {
      console.error("Failed to load micro frontend:", err);
      return {
        default: () => fallback || <NotFound />,
      };
    })
  );

// === Component registry ===
const arrComponents = {
  DashBoard: LazyWithFallback(() => import("./SubPages/DashBoard")),
  RefMasExpenseList: LazyWithFallback(() => import("reports/RefMasExpenseList")),
  RefMasExpenseForm: LazyWithFallback(() => import("reports/RefMasExpenseForm")),
  RefMasIncomeList: LazyWithFallback(() => import("reports/RefMasIncomeList")),
  RefMasIncomeForm: LazyWithFallback(() => import("reports/RefMasIncomeForm")),
  TransactionForm: LazyWithFallback(() => import("reports/TransactionsForm")),
  RefMasAccountsList: LazyWithFallback(() => import("reports/RefMasAccountsList")),
  RefMasAccountsForm: LazyWithFallback(() => import("reports/RefMasAccountsForm")),
  NotFound: LazyWithFallback(() => import("./404")),
};

// === Icon registry ===
const iconComponents = {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TransactionOutlined,
  DeliveredProcedureOutlined,
  FastForwardOutlined,
  AccountBookOutlined
};

// === Tracks which components need `navigate` ===
const microFrontsNeedingNavigate = {
  RefMasAccountsForm: true,
  RefMasAccountsList: true
};

// === HOC to optionally inject `navigate` prop ===
const withOptionalNavigate = (Component, passNavigate = false) => {
  return (props) => {
    const navigate = useNavigate();
    return <Component {...props} {...(passNavigate ? { navigate } : {})} />;
  };
};

const Home = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [responseData, setResponseData] = useState([]);
  const [sideBarFormData, setSideBarFormFormData] = useState([]);
  const [spinning, setSpinning] = useState(true);
  const [routeList, setRouteList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getForms = async () => {
      try {
        const response = await Axios.get(`${window.env?.REACT_APP_API_URL}api/home/getForms`);
        setResponseData(response.data);
      } catch (error) {
        console.error("Error loading forms:", error);
      }
    };

    getForms();
  }, []);

  useEffect(() => {
    if (!responseData) return;

    const formattedData = [];
    const formattedRoutes = [];

    responseData.forEach((item, index) => {
      if (item.str_isMenu !== "Y") return;

      const icon = item.str_icon && iconComponents[item.str_icon]
        ? React.createElement(iconComponents[item.str_icon])
        : null;

      const formattedItem = {
        key: item.str_form_id,
        icon,
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
          formattedData.push({
            key: index.toString(),
            label: item.str_menu_id,
            children: [formattedItem],
          });
        }
      } else {
        formattedData.push(formattedItem);
      }
    });

    responseData.forEach((item) => {
      if (item.str_link === "/home") return;
      formattedRoutes.push({
        path: item.str_link.replace(/^\/home/, ""),
        element: item.str_component,
      });
    });

    setSideBarFormFormData(formattedData);
    setRouteList(formattedRoutes);
    if (formattedRoutes.length > 0) setSpinning(false);
  }, [responseData]);

  const MenuItemClicked = ({ item }) => {
    if (item.props?.link) navigate(item.props.link);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideBarAnt
        collapsed={collapsed}
        MenuItemClicked={MenuItemClicked}
        sideBarFormData={sideBarFormData}
      />
      <Layout>
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
          {spinning ? (
            <Skeleton active />
          ) : (
            <Suspense fallback={<Skeleton active />}>
              <UserRoutes routeList={routeList} />
            </Suspense>
          )}
        </Content>
        <FooterAnt />
      </Layout>
    </Layout>
  );
};

const UserRoutes = ({ routeList }) => (
  <Routes>
    <Route path="/" element={<arrComponents.DashBoard />} />
    {routeList.map((route, index) => {
      const Component = arrComponents[route.element] || arrComponents.NotFound;
      return <Route key={index} path={route.path} element={<Component />} />;
    })}
    <Route path="*" element={<arrComponents.NotFound />} />
  </Routes>
);

export default Home;
