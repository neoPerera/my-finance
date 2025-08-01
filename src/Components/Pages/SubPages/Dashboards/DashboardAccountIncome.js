import React from 'react';
import { useState, useEffect } from "react";
import Axios from "axios";
import CountUp from "react-countup";
import Loading from "../../../Elements/Loading";
import "./DashboardCard.css";

const DashboardAccountIncome = () => {
    const [spinning, setSpinning] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const formatter = (value) => <CountUp end={value} separator="," />;

    useEffect(() => {
        const fetchData = async () => {
            setSpinning(true);
            setErrorMessage("");
            try {
                console.log(window.env?.REACT_APP_API_URL);
                const response = await Axios.get(
                    `${window.env?.REACT_APP_API_URL}api/dashboard/getdashboardaccountincomes`
                );

                console.log("income List Data:", response.data);

                const newData = response.data;

                // Update the state with the new data
                setChartData(newData || []);
                console.log(newData);
                setSpinning(false);
            } catch (error) {
                setSpinning(false);
                setErrorMessage(`Error: ${error.message}`);
                console.error("Error fetching income list:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard-card">
            <div className="card-header">
                <h3>Account Incomes</h3>
            </div>
            <div className="card-content">
                {spinning ? (
                    <Loading />
                ) : errorMessage ? (
                    <div className="error-message">{errorMessage}</div>
                ) : (
                    <>
                        {chartData.length > 0 && (
                            <>
                                {chartData.map((item) => (
                                    <div key={item.type} className="statistic-item">
                                        <div className="statistic-title">{item.type} Incomes (LKR)</div>
                                        <div className="statistic-value income">
                                            <CountUp end={item.value} separator="," decimals={2} />
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardAccountIncome;
