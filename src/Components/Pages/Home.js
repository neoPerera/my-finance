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

const { Content } = Layout;

const LazyWithFallback = (importFunc, fallback = null) =>
  React.lazy(() =>
    importFunc().catch((err) => {
      console.error("Failed to load micro frontend:", err);
      return {
        default: () => fallback || <div>Component unavailable</div>,
      };
    })
  );

const arrComponents = {
  DashBoard: LazyWithFallback(() => import("./SubPages/DashBoard")),
  RefMasExpenseList: LazyWithFallback(() => import("./SubPages/MyFinance/Reference/RexExpenses/RefMasExpenseList")),
  RefMasExpenseForm: LazyWithFallback(() => import("./SubPages/MyFinance/Reference/RexExpenses/RefMasExpenseForm")),
  RefMasIncomeList: LazyWithFallback(() => import("./SubPages/MyFinance/Reference/RefIncome/RefMasIncomeList")),
  RefMasIncomeForm: LazyWithFallback(() => import("./SubPages/MyFinance/Reference/RefIncome/RefMasIncomeForm")),
  TransactionForm: LazyWithFallback(() => import("./SubPages/MyFinance/Transaction/TransactionsForm")),
  RefMasAccountsList: LazyWithFallback(() => import("./SubPages/MyFinance/Reference/RefAccounts/RefMasAccountsList")),
  RefMasAccountsForm: LazyWithFallback(() => import("./SubPages/MyFinance/Reference/RefAccounts/RefMasAccountsForm")),
  PRRequestList: LazyWithFallback(() => import("./SubPages/Purchasing/Request/PRRequestList")),
  // ReportApp: LazyWithFallback(() => import("reports/ReportApp")),
  NotFound: LazyWithFallback(() => import("./404")),
};
const iconComponents = {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TransactionOutlined,
  DeliveredProcedureOutlined,
  FastForwardOutlined,
  AccountBookOutlined
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
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}main/home/getForms`
        );
        setResponseData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getForms();
  }, []);

  useEffect(() => {
  if (!responseData) return;

  const formattedData = [];
  const formattedRoutes = [];

  const addToNestedTree = (tree, pathParts, formattedItem) => {
    let currentLevel = tree;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      let existingNode = currentLevel.find((node) => node.label === part);

      if (!existingNode) {
        existingNode = {
          key: part + "-" + i + "-" + Math.random().toString(36).substr(2, 5),
          label: part,
          children: [],
        };
        currentLevel.push(existingNode);
      }

      if (i === pathParts.length - 1) {
        existingNode.children.push(formattedItem);
      } else {
        currentLevel = existingNode.children;
      }
    }
  };

  responseData.forEach((item) => {
    if (item.str_isMenu !== "Y") return;

    const icon =
      item.str_icon && iconComponents[item.str_icon]
        ? React.createElement(iconComponents[item.str_icon])
        : null;

    const formattedItem = {
      key: item.str_form_id,
      icon,
      label: item.str_form_name,
      link: item.str_link,
    };

    if (item.str_menu_id && item.str_menu_id.includes("/")) {
      const pathParts = item.str_menu_id.split("/");
      addToNestedTree(formattedData, pathParts, formattedItem);
    } else if (item.str_menu_id) {
      // Single-level menu (no `/`)
      const existing = formattedData.find((node) => node.label === item.str_menu_id);
      if (existing) {
        existing.children.push(formattedItem);
      } else {
        formattedData.push({
          key: item.str_menu_id,
          label: item.str_menu_id,
          children: [formattedItem],
        });
      }
    } else {
      // No menu_id — top-level menu item
      formattedData.push(formattedItem);
    }
  });

  // Routes
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
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            borderRadius: 16,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(24, 144, 255, 0.2), transparent)",
            }}
          />
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
    <Route
      path="/"
      element={<arrComponents.DashBoard />}
    />
    {routeList.map((route, index) => {
      const LazyComponent = arrComponents[route.element] || arrComponents.NotFound;
      return (
        <Route
          key={index}
          path={route.path}
          element={<LazyComponent />}
        />
      );
    })}
    <Route path="*" element={<arrComponents.NotFound />} />
  </Routes>
);

export default Home;
