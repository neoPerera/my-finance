import {
  Card,
  Col,
  Flex,
  Row,
  Skeleton,
  Space,
  Spin,
  Statistic,
  Table,
  message,
} from "antd";
import * as React from "react";
import { Liquid, Pie, Sankey } from "@antv/g2plot";
import { useState, useEffect, useRef } from "react";
import CountUp from "react-countup";
import Axios from "axios";
import DashboardAccountBalance from "./Dashboards/DashboardAccountBalance";
import DashboardAccountIncome from "./Dashboards/DashboardAccountIncome";
import DashboardAccountExpense from "./Dashboards/DashboardAccountExpense";
import DashboardTransactionsTable from "./Dashboards/DashboardTransactionsTable";

function DashBoard() {
  // Use React state to manage the chart instance

  const [spinning, setSpinning] = React.useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [chartData, setChartData] = React.useState({
    chart1: [],
    chart2: [],
    chart3: [],
    chart4: [[], 0],
    chartExpenses: [],
    chartIncomes: []
  });
  const formatter = (value) => <CountUp end={value} separator="," />;
  const data = {
    transTable: {
      columns: [
        // {
        //   title: "Key",
        //   dataIndex: "key",
        //   key: "Key",
        // },
        {
          title: "Account",
          dataIndex: "account",
          key: "account",
        },
        {
          title: "Reason",
          dataIndex: "name",
          key: "age",
        },
        {
          title: "Amount",
          dataIndex: "int_amount_char",
          key: "amount",
        },
      ],
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setSpinning(true);
      try {
        console.log(window.env?.REACT_APP_API_URL);
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}api/dashboard`
        );

        console.log("income List Data:", response.data);

        const newData = response.data;

        // Update the state with the new data
        setChartData({
          chart1: newData.chart1[0] || [],
          chart2: newData.chart2[0] || [],
          chart3: newData.chart3[0] || [],
          chart4: newData.chart4 || [],
          chartExpenses: newData.chartExpenses[0] || [],
          chartIncomes: newData.chartIncomes[0] || []
        });
        console.log(newData);
        setSpinning(false);
      } catch (error) {
        setSpinning(false);
        messageApi.open({
          type: "error",
          content: `${error}`,
        });
        console.error("Error fetching income list:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {spinning ? (
        <Skeleton active />
      ) : (
        <>
          {contextHolder}
          <Flex wrap="wrap" gap="middle">
            {/* <Row> */}
            <DashboardAccountBalance chartData={chartData} formatter={formatter} />
            <DashboardAccountIncome chartData={chartData} formatter={formatter} />
            <DashboardAccountExpense chartData={chartData} formatter={formatter} />
            <DashboardTransactionsTable chartData={chartData} data={data} />
          </Flex>
        </>
      )}
    </>
  );
}



export default DashBoard;
