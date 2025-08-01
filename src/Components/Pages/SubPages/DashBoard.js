import React from "react";
import {
  message,
} from "antd";
import DashboardAccountBalance from "./Dashboards/DashboardAccountBalance";
import DashboardAccountIncome from "./Dashboards/DashboardAccountIncome";
import DashboardAccountExpense from "./Dashboards/DashboardAccountExpense";
import DashboardTransactionsTable from "./Dashboards/DashboardTransactionsTable";
import "./Dashboards/Dashboard.css";

function DashBoard() {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className="dashboard-container">
      {contextHolder}
      <div className="dashboard-grid">
        <DashboardAccountBalance />
        <DashboardAccountIncome />
        <DashboardAccountExpense />
        <DashboardTransactionsTable />
      </div>
    </div>
  );
}

export default DashBoard;
