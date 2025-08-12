import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Table from "../../../../../Elements/imports/Table";
import "./RefMasAccountsList.css";

function RefMasAccountsList() {
  // Refs and state
  const isMounted = useRef(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleAdd = () => {
    navigate("/home/ref-accounts/add");
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
        `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-accounts/update`,
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
      if (error.response?.data?.error?.detail) {
        showMessage("error", error.response.data.error.detail);
      } else {
        showMessage("error", "An error occurred while saving");
      }
      console.error("Save error:", error);
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
      render: (value) => <span className="account-name">{value}</span>,
    },
    {
      title: "Created Date",
      dataIndex: "dtm_date",
      key: "dtm_date",
      className: "date-cell",
      sortable: true,
    },
  ];

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setSpinning(true);
      try {
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-accounts/getaccounts`
        );
        console.log("Accounts List:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching accounts list:", error);
        showMessage("error", "Failed to fetch accounts data");
      } finally {
        setSpinning(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="accounts-list-container">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="accounts-list-header">
        <h2>Accounts Master</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <span className="btn-icon">+</span>
          Add New
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
        emptyMessage="No accounts data available"
        searchPlaceholder="Search accounts..."
        className="accounts-table-wrapper"
      />
    </div>
  );
}

export default RefMasAccountsList;
