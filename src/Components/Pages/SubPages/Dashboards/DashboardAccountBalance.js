import React from 'react';
import { Col, Card, Statistic, message, Skeleton } from 'antd';
import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import CountUp from "react-countup";

const DashboardAccountBalance = () => {
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
          `${window.env?.REACT_APP_API_URL}api/myfinance/dashboard/getdashboardaccountbalances`
        );

        console.log("DashboardBalance List Data:", response.data);

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
          <Col xs={20} sm={12} md={8} lg={6} xl={4}>
            <Card title="Account Balance">
              {chartData.length > 0 && (
                <>
                  {chartData.map((item) => (
                    <Statistic
                      key={item.account_name}
                      title={`${item.account_name} Balance (LKR)`}
                      value={item.account_balance}
                      precision={2}
                      formatter={formatter}
                    />
                  ))}
                </>
              )}
            </Card>
          </Col>
        </>
      )}
    </>
  );
};

export default DashboardAccountBalance;
