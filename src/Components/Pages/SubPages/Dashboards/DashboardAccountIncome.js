import React from 'react';
import { Card, Statistic, message, Skeleton } from 'antd';
import { useState, useEffect } from "react";
import Axios from "axios";
import CountUp from "react-countup";

const DashboardAccountIncome = () => {
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
                    `${window.env?.REACT_APP_API_URL}myfinance/dashboard/getdashboardaccountincomes`
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
                <Card title="Account Incomes" className="dashboard-card">
                    {chartData.length > 0 ? (
                        <>
                            {chartData.map((item) => (
                                <div key={item.type} className="dashboard-statistic income">
                                    <Statistic
                                        title={`${item.type} Incomes (LKR)`}
                                        value={item.value}
                                        precision={2}
                                        formatter={formatter}
                                    />
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="dashboard-statistic income">
                            <Statistic
                                title="No Income Data Available"
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

export default DashboardAccountIncome;
