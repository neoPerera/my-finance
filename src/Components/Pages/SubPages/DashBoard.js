import React from "react";
import DashboardAccountBalance from "./Dashboards/DashboardAccountBalance";
import DashboardAccountIncome from "./Dashboards/DashboardAccountIncome";
import DashboardAccountExpense from "./Dashboards/DashboardAccountExpense";
import DashboardTransactionsTable from "./Dashboards/DashboardTransactionsTable";
import "./DashBoard.css";

function DashBoard() {
  return (
    <div className="dashboard">
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
