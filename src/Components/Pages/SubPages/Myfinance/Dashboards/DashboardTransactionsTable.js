import React from 'react';
import { useState, useEffect } from "react";
import Axios from "axios";
import Loading from "../../../../Elements/Loading";
import "./DashboardCard.css";

const DashboardTransactionsTable = () => {
  const [spinning, setSpinning] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const columns = [
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "Reason",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "int_amount_char",
      key: "amount",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setSpinning(true);
      setErrorMessage("");
      try {
        console.log(window.env?.REACT_APP_API_URL);
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}main/dashboard/getdashboardtransactions`
        );

        console.log("transactions List Data:", response.data);

        const newData = response.data;

        // Update the state with the new data
        setChartData(newData || []);
        console.log(newData);
        setSpinning(false);
      } catch (error) {
        setSpinning(false);
        setErrorMessage(`Error: ${error.message}`);
        console.error("Error fetching transactions list:", error);
      }
    };
    fetchData();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(chartData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = chartData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="dashboard-card table-card">
      <div className="card-header">
        <h3>Transactions</h3>
      </div>
      <div className="card-content">
        {spinning ? (
          <Loading />
        ) : errorMessage ? (
          <div className="error-message">{errorMessage}</div>
        ) : (
          <>
            {chartData.length > 0 && (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column.key}>{column.title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.account}</td>
                        <td>{item.name}</td>
                        <td>{item.int_amount_char}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Pagination moved outside table container to bottom of card */}
      {!spinning && !errorMessage && chartData.length > 0 && totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardTransactionsTable;
