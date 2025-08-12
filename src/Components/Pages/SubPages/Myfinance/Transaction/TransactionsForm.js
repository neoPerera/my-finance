import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Form from "../../../../Elements/imports/Form";
import "./TransactionForm.css";

function TransactionForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [transTypes, setTransTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accounts2, setAccounts2] = useState([]);
  const [transCats, setTransCats] = useState([]);
  const [isTransCatLoading, setIsTransCatLoading] = useState(false);
  const [isDoubleEntry, setIsDoubleEntry] = useState(false);
  const [fields, setFields] = useState([
    {
      name: "strId",
      label: "ID",
      type: "text",
      disabled: true,
      rules: { required: true }
    },
    {
      name: "floatAmount",
      label: "Amount",
      type: "text",
      rules: { required: true },
      placeholder: "Enter amount (e.g., 1539.92)"
    },
    {
      name: "strAccount",
      label: "Account",
      type: "select",
      rules: { required: true },
      options: [],
      placeholder: "Select an Account"
    },
    {
      name: "strTransType",
      label: "Transaction Type",
      type: "select",
      rules: { required: true },
      options: [],
      placeholder: "Select a type"
    },
    {
      name: "strTransCat",
      label: "Category",
      type: "select",
      rules: { required: true },
      options: [],
      placeholder: "Select transaction type first",
      disabled: true
    },
    {
      name: "strName",
      label: "Reason",
      type: "text",
      rules: { required: true, minLength: 2, maxLength: 200 },
      placeholder: "Enter transaction reason"
    }
  ]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleGoBack = () => {
    navigate("/home");
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      // Prepare the data for submission
      const submitData = { ...formData };
      
      // If double entry is enabled, add the second account
      if (isDoubleEntry) {
        submitData.strAccount2 = formData.strAccount2;
      }

      const response = await Axios.post(
        `${window.env?.REACT_APP_API_URL}myfinance/transaction/add`,
        submitData
      );
      
      console.log("Response:", response.data);
      showMessage("success", "Transaction saved successfully!");
      
      // Reset form and reload data
      setTimeout(() => {
        getSequence();
        setIsDoubleEntry(false);
        setTransCats([]);
        showMessage("", "");
      }, 2000);
      
    } catch (error) {
      console.error("Error:", error.response);
      if (error.response?.data?.error?.detail) {
        showMessage("error", error.response.data.error.detail);
      } else if (error.response?.status === 500) {
        showMessage("error", "Server error. Please try again later.");
      } else if (error.response?.status === 400) {
        showMessage("error", "Invalid data. Please check your input.");
      } else if (error.code === 'NETWORK_ERROR') {
        showMessage("error", "Network error. Please check your connection.");
      } else {
        showMessage("error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    // Update the field value in the fields array
    setFields(prevFields => 
      prevFields.map(field => 
        field.name === fieldName 
          ? { ...field, defaultValue: value }
          : field
      )
    );

    // Handle special field changes
    if (fieldName === "strTransType") {
      handleTransactionTypeChange(value);
    } else if (fieldName === "strAccount") {
      handleAccountChange(value);
    } else if (fieldName === "isDoubleEntry") {
      handleDoubleEntryChange(value);
    }
  };

  const handleTransactionTypeChange = async (value) => {
    // Clear categories first
    setFields(prevFields => 
      prevFields.map(field => 
        field.name === "strTransCat" 
          ? { ...field, options: [], defaultValue: "", disabled: true }
          : field
      )
    );

    if (!value) return;

    let strTransCatURL = "";
    if (value === "INC") {
      strTransCatURL = "myfinance/reference/ref-income/getincome";
    } else if (value === "EXP") {
      strTransCatURL = "myfinance/reference/ref-expense/getexpense";
    }

    setIsTransCatLoading(true);
    
    try {
      const response = await Axios.get(
        `${window.env?.REACT_APP_API_URL}${strTransCatURL}`
      );
      
      const categoryOptions = response.data.map((item) => ({
        label: item.str_name,
        value: item.key,
      }));

      setFields(prevFields => 
        prevFields.map(field => 
          field.name === "strTransCat" 
            ? { 
                ...field, 
                options: categoryOptions, 
                disabled: false,
                placeholder: "Select a category"
              }
            : field
        )
      );
    } catch (error) {
      console.error("Error:", error);
      showMessage("error", "Failed to load transaction categories. Please try again.");
    } finally {
      setIsTransCatLoading(false);
    }
  };

  const handleAccountChange = (value) => {
    if (isDoubleEntry) {
      const filteredAccounts = accounts.filter(acc => acc.value !== value);
      setAccounts2(filteredAccounts);
      
      // Update the second account field if it exists
      setFields(prevFields => {
        const hasAccount2 = prevFields.some(field => field.name === "strAccount2");
        if (hasAccount2) {
          return prevFields.map(field => 
            field.name === "strAccount2" 
              ? { ...field, options: filteredAccounts, defaultValue: "" }
              : field
          );
        }
        return prevFields;
      });
    }
  };

  const handleDoubleEntryChange = (value) => {
    setIsDoubleEntry(value);
    
    if (value) {
      // Add second account field
      const currentAccount = fields.find(f => f.name === "strAccount")?.defaultValue;
      const filteredAccounts = accounts.filter(acc => acc.value !== currentAccount);
      
      setFields(prevFields => {
        const hasAccount2 = prevFields.some(field => field.name === "strAccount2");
        if (!hasAccount2) {
          return [
            ...prevFields,
            {
              name: "strAccount2",
              label: "Second Account",
              type: "select",
              rules: { required: true },
              options: filteredAccounts,
              placeholder: "Select 2nd Account"
            }
          ];
        }
        return prevFields;
      });
    } else {
      // Remove second account field
      setFields(prevFields => 
        prevFields.filter(field => field.name !== "strAccount2")
      );
    }
  };

  const getSequence = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${window.env?.REACT_APP_API_URL}myfinance/transaction/getsequence?type=id`
      );
      
      console.log(response);
      
      // Update fields with sequence data
      setFields(prevFields => 
        prevFields.map(field => {
          if (field.name === "strId") {
            return { ...field, defaultValue: response.data.sequence_id.toString() };
          } else if (field.name === "strTransType") {
            return { ...field, options: response.data.trans_types[0] };
          } else if (field.name === "strAccount") {
            return { ...field, options: response.data.accounts[0] };
          }
          return field;
        })
      );
      
      setTransTypes(response.data.trans_types[0]);
      setAccounts(response.data.accounts[0]);
      
    } catch (error) {
      console.error("Error:", error);
      showMessage("error", "Failed to load initial data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSequence();
  }, []);

  return (
    <div className="transaction-form-wrapper">
      {/* Double Entry Toggle */}
      <div className="double-entry-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={isDoubleEntry}
            onChange={(e) => handleDoubleEntryChange(e.target.checked)}
            className="toggle-input"
          />
          <span className="toggle-slider"></span>
          <span className="toggle-text">Double Entry</span>
        </label>
      </div>

      <Form
        title="Transaction Form"
        fields={fields}
        onSubmit={handleSubmit}
        loading={loading}
        message={message}
        onMessageClose={() => setMessage({ type: "", text: "" })}
        onGoBack={handleGoBack}
        showGoBack={true}
        className="transaction-form-container"
        onFieldChange={handleFieldChange}
      />
    </div>
  );
}

export default TransactionForm;
