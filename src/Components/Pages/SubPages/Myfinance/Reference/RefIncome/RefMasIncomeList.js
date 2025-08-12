////////////////////////////////////////////////////////////////////////////////////////////////////////
// Income master list
// Developed by Chanuth Perera
////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Table from "../../../../../Elements/imports/Table";
import "./RefMasIncomeList.css";

function RefMasIncomeList() {
  // Hooks
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleAdd = () => {
    navigate("/home/ref-income/add");
  };

  const handleSave = async (key, updatedData) => {
    try {
      setSpinning(true);
      
      // Validate required fields
      if (!updatedData.str_name || updatedData.str_name.trim() === "") {
        showMessage("error", "Name is required");
        return;
      }

      const payload = {
        str_id: key,
        updates: updatedData,
      };

      await Axios.post(
        `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-income/update`,
        payload
      );

      showMessage("success", "Successfully saved");

      // Update local data
      const updatedDataArray = [...data];
      const index = updatedDataArray.findIndex((item) => item.key === key);
      if (index > -1) {
        updatedDataArray[index] = { ...updatedDataArray[index], ...updatedData };
        setData(updatedDataArray);
      }
    } catch (error) {
      showMessage("error", error?.response?.data?.error?.detail || "Update failed");
      console.error("Update error:", error);
    } finally {
      setSpinning(false);
    }
  };

  // Define table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      className: "id-cell",
      width: "80px",
    },
    {
      title: "Name",
      dataIndex: "str_name",
      key: "str_name",
      className: "name-cell",
      editable: true,
      render: (value) => <span className="income-name">{value}</span>,
    },
    {
      title: "Created Date",
      dataIndex: "dtm_date",
      key: "dtm_date",
      className: "date-cell",
      sortable: true,
    },
  ];

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      setSpinning(true);
      try {
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-income/getincome`
        );
        setData(response.data);
        console.log("Income list:", response.data);
      } catch (error) {
        console.error("Failed to fetch income list:", error);
        showMessage("error", "Failed to fetch income data");
      } finally {
        setSpinning(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="income-list-container">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="income-list-header">
        <h2>Income Master</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <span className="btn-icon">+</span>
          Add new
        </button>
      </div>

      <Table
        data={data}
        columns={columns}
        pageSize={10}
        searchable={true}
        sortable={true}
        editable={true}
        onSave={handleSave}
        loading={spinning}
        emptyMessage="No income data available"
        searchPlaceholder="Search income..."
        className="income-table-wrapper"
      />
    </div>
  );
}

export default RefMasIncomeList;
