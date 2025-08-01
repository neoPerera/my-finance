import React from 'react';
import { Card, Table, message, Skeleton } from 'antd';
import { useState, useEffect } from "react";
import Axios from "axios";

const DashboardTransactionsTable = () => {
  const [spinning, setSpinning] = React.useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [chartData, setChartData] = React.useState([]);
  
  const data = {
    transTable: {
      columns: [
        {
          title: "Account",
          dataIndex: "account",
          key: "account",
          responsive: ['md'],
        },
        {
          title: "Reason",
          dataIndex: "name",
          key: "reason",
          responsive: ['sm'],
        },
        {
          title: "Amount",
          dataIndex: "int_amount_char",
          key: "amount",
          responsive: ['xs'],
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
      {contextHolder}
      {spinning ? (
        <div className="dashboard-skeleton">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : (
        <Card title="Transactions" className="dashboard-card">
          {chartData.length > 0 ? (
            <div className="dashboard-table">
              <Table
                size="small"
                scroll={{ x: 500 }}
                dataSource={chartData}
                columns={data?.transTable?.columns || []}
                pagination={{ 
                  pageSize: 10,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
                }}
                rowKey={(record) => record.key || record.id || Math.random()}
              />
            </div>
          ) : (
            <div className="dashboard-statistic">
              <div style={{ textAlign: 'center', padding: '20px', color: '#8c8c8c' }}>
                No transaction data available
              </div>
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default DashboardTransactionsTable;
