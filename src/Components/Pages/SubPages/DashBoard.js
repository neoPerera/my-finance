import React from "react";
import {
  Flex,
  message,
} from "antd";
import DashboardAccountBalance from "./Dashboards/DashboardAccountBalance";
import DashboardAccountIncome from "./Dashboards/DashboardAccountIncome";
import DashboardAccountExpense from "./Dashboards/DashboardAccountExpense";
import DashboardTransactionsTable from "./Dashboards/DashboardTransactionsTable";

function DashBoard() {

  const [messageApi, contextHolder] = message.useMessage();
  

  return (
    <>

      {contextHolder}
      <Flex wrap="wrap" gap="middle">
        {/* <Row> */}
        <DashboardAccountBalance />
        <DashboardAccountIncome />
        <DashboardAccountExpense />
        <DashboardTransactionsTable />
      </Flex>
    </>

  );
}



export default DashBoard;
