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
  RefMasExpenseList: LazyWithFallback(() => import("./SubPages/Reference/RexExpenses/RefMasExpenseList")),
  RefMasExpenseForm: LazyWithFallback(() => import("./SubPages/Reference/RexExpenses/RefMasExpenseForm")),
  RefMasIncomeList: LazyWithFallback(() => import("./SubPages/Reference/RefIncome/RefMasIncomeList")),
  RefMasIncomeForm: LazyWithFallback(() => import("./SubPages/Reference/RefIncome/RefMasIncomeForm")),
  TransactionForm: LazyWithFallback(() => import("./SubPages/Transaction/TransactionsForm")),
  RefMasAccountsList: LazyWithFallback(() => import("./SubPages/Reference/RefAccounts/RefMasAccountsList")),
  RefMasAccountsForm: LazyWithFallback(() => import("./SubPages/Reference/RefAccounts/RefMasAccountsForm")),
  //ReportApp: LazyWithFallback(() => import("reports/ReportApp")),
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
          `${window.env?.REACT_APP_API_URL}api/main/home/getForms`
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

    // recursive insert function
    const insertIntoTree = (tree, pathParts, fullItem) => {
      if (pathParts.length === 0) return;

      const currentPart = pathParts[0];
      let node = tree.find((t) => t.label === currentPart);

      if (!node) {
        node = {
          key: currentPart,
          label: currentPart,
          children: [],
        };
        tree.push(node);
      }

      if (pathParts.length === 1) {
        // leaf → add actual menu item
        node.children.push({
          key: fullItem.str_form_id,
          icon:
            fullItem.str_icon && iconComponents[fullItem.str_icon]
              ? React.createElement(iconComponents[fullItem.str_icon])
              : null,
          label: fullItem.str_form_name,
          link: fullItem.str_link,
        });
      } else {
        insertIntoTree(node.children, pathParts.slice(1), fullItem);
      }
    };

    const formattedData = [];
    const formattedRoutes = [];

    responseData.forEach((item) => {
      if (item.str_isMenu !== "Y") return;

      if (item.str_menu_id) {
        const parts = item.str_menu_id.split("/"); // split by "/"
        insertIntoTree(formattedData, parts, item);
      } else {
        // root-level item
        formattedData.push({
          key: item.str_form_id,
          icon:
            item.str_icon && iconComponents[item.str_icon]
              ? React.createElement(iconComponents[item.str_icon])
              : null,
          label: item.str_form_name,
          link: item.str_link,
        });
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
      const LazyComponent = arrComponents[route.element] || arrComponents.NotFound;
      return <Route key={index} path={route.path} element={<LazyComponent />} />;
    })}
    <Route path="*" element={<arrComponents.NotFound />} />
  </Routes>
);

export default Home;
