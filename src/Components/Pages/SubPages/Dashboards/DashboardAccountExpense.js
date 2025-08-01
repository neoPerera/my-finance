import React from 'react';
import { Card, Statistic, message, Skeleton } from 'antd';
import { useState, useEffect } from "react";
import Axios from "axios";
import CountUp from "react-countup";

const DashboardAccountExpense = () => {
  const [spinning, setSpinning] = React.useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [chartData, setChartData] = React.useState([]);
  const formatter = (value) => <CountUp end={value} separator="," />;

  useEffect(() => {
    const fetchData = async () => {
      setSpinning(true);
      try {
        console.log(window.env?.REACT_APP_API_URL);
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}myfinance/dashboard/getdashboardaccountexpenses`
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
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      ) : (
        <Card title="Account Expenses" className="dashboard-card">
          {chartData.length > 0 ? (
            <>
              {chartData.map((item) => (
                <div key={item.type} className="dashboard-statistic expense">
                  <Statistic
                    title={`${item.type} Expenses (LKR)`}
                    value={item.value}
                    precision={2}
                    formatter={formatter}
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="dashboard-statistic expense">
              <Statistic
                title="No Expense Data Available"
                value={0}
                precision={2}
                formatter={formatter}
              />
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default DashboardAccountExpense;
