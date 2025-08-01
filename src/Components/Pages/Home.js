import Axios from "axios";
import React, { useEffect, useState, Suspense } from "react";
import {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TransactionOutlined,
  DeliveredProcedureOutlined,
  FastForwardOutlined,
  AccountBookOutlined
} from "../Elements/Icons";
import { useNavigate, Routes, Route } from "react-router-dom";
import SideBar from "../Elements/SideBar";
import Header from "../Elements/Header";
import Footer from "../Elements/Footer";
import Loading from "../Elements/Loading";
import "./Home.css";

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
  const [responseData, setResponseData] = useState([]);
  const [sideBarFormData, setSideBarFormFormData] = useState([]);
  const [spinning, setSpinning] = useState(true);
  const [routeList, setRouteList] = useState([]);
  const [isMobileSidebarExpanded, setIsMobileSidebarExpanded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getForms = async () => {
      try {
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}api/home/getForms`
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
        props: { link: item.str_link }
      };

      if (item.str_menu_id) {
        // Parse the menu hierarchy from str_menu_id (e.g., "myfinance/reference/expense")
        const menuPath = item.str_menu_id.split('/');
        
        // Find or create the menu hierarchy
        let currentLevel = formattedData;
        let currentPath = '';
        
        menuPath.forEach((pathSegment, pathIndex) => {
          currentPath += (currentPath ? '/' : '') + pathSegment;
          
          // Find existing menu at this level
          let existingMenu = currentLevel.find(menu => menu.label === pathSegment);
          
          if (!existingMenu) {
            // Create new menu level
            existingMenu = {
              key: `${currentPath}-${pathIndex}`,
              label: pathSegment,
              children: []
            };
            currentLevel.push(existingMenu);
          }
          
          // If this is the last segment, add the actual menu item
          if (pathIndex === menuPath.length - 1) {
            existingMenu.children.push(formattedItem);
          } else {
            // Move to next level
            currentLevel = existingMenu.children;
          }
        });
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

  const handleToggleSidebar = () => {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setIsMobileSidebarExpanded(!isMobileSidebarExpanded);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="home-layout">
      <SideBar
        collapsed={collapsed}
        MenuItemClicked={MenuItemClicked}
        sideBarFormData={sideBarFormData}
        isMobileExpanded={isMobileSidebarExpanded}
        setIsMobileExpanded={setIsMobileSidebarExpanded}
        isLoading={spinning}
      />
      <div className="main-content">
        <Header
          setCollapsed={setCollapsed}
          collapsed={collapsed}
          MenuItemClicked={MenuItemClicked}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="content-area">
          <Suspense fallback={<Loading />}>
            <UserRoutes routeList={routeList} />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
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
