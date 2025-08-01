import React from 'react';
import { Col, Card, Table, message, Skeleton } from 'antd';
import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import CountUp from "react-countup";

const DashboardTransactionsTable = () => {
  const [spinning, setSpinning] = React.useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [chartData, setChartData] = React.useState([]);
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
          `${window.env?.REACT_APP_API_URL}myfinance/dashboard/getdashboardtransactions`
        );

        console.log("income List Data:", response.data);

        const newData = response.data;

        // Update the state with the new data
        setChartData(newData || []);
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
        <Skeleton.Node active />
      ) : (
        <>
          <Col xs={20} sm={12} md={8} lg={6} xl={7}>
            <Card title="Transactions">
              {chartData.length > 0 && (
                <Table
                  size="small"
                  scroll={{ x: 500 }}
                  dataSource={chartData}
                  columns={data?.transTable?.columns || []}
                  pagination={{ pageSize: 10 }}
                />
              )}
            </Card>
          </Col>
        </>
      )}
    </>
  );
};

export default DashboardTransactionsTable;
