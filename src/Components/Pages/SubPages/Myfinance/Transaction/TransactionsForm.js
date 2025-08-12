import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Form, { FormItem, Input, Select } from "../../../../Elements/imports/Form";
import HelpDropdown from "../../../../Elements/imports/HelpDropdown";
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
  const [formData, setFormData] = useState({});

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
        setFormData({});
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
    // Update form data
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

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
    console.log("Transaction type changed to:", value);
    
    // Clear categories first
    setTransCats([]);

    if (!value) return;

    let strTransCatURL = "";
    if (value === "INC") {
      strTransCatURL = "myfinance/reference/ref-income/getincome";
    } else if (value === "EXP") {
      strTransCatURL = "myfinance/reference/ref-expense/getexpense";
    }

    console.log("Fetching categories from:", strTransCatURL);
    setIsTransCatLoading(true);
    
    try {
      const response = await Axios.get(
        `${window.env?.REACT_APP_API_URL}${strTransCatURL}`
      );
      
      console.log("Categories API Response:", response.data);
      
      const categoryOptions = response.data.map((item) => ({
        label: item.str_name,
        value: item.key,
      }));

      console.log("Setting transCats:", categoryOptions);
      setTransCats(categoryOptions);
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
    }
  };

  const handleDoubleEntryChange = (value) => {
    setIsDoubleEntry(value);
    
    if (value) {
      // Add second account field
      const currentAccount = formData.strAccount;
      const filteredAccounts = accounts.filter(acc => acc.value !== currentAccount);
      setAccounts2(filteredAccounts);
    }
  };

  const getSequence = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${window.env?.REACT_APP_API_URL}myfinance/transaction/getsequence?type=id`
      );
      
      console.log("API Response:", response.data);
      
      // Check the actual response structure and handle it safely
      let sequenceId = null;
      if (response.data && response.data.sequence_id) {
        sequenceId = response.data.sequence_id;
      } else if (response.data && response.data.output_value) {
        sequenceId = response.data.output_value;
      } else if (response.data && typeof response.data === 'string') {
        sequenceId = response.data;
      } else if (response.data && typeof response.data === 'number') {
        sequenceId = response.data;
      }
      
      // Update form data with sequence ID
      if (sequenceId !== null) {
        setFormData(prev => ({
          ...prev,
          strId: sequenceId.toString()
        }));
      } else {
        console.warn("No sequence ID found in response:", response.data);
        showMessage("error", "Failed to get sequence number");
      }
      
      // Update state variables with the fetched data
      const transTypesData = response.data.trans_types?.[0] || [];
      const accountsData = response.data.accounts?.[0] || [];
      
      console.log("Setting transTypes:", transTypesData);
      console.log("Setting accounts:", accountsData);
      
      setTransTypes(transTypesData);
      setAccounts(accountsData);
      
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

  // Debug useEffect to track state changes
  useEffect(() => {
    console.log("State updated - transTypes:", transTypes);
    console.log("State updated - accounts:", accounts);
    console.log("State updated - transCats:", transCats);
    console.log("State updated - formData:", formData);
  }, [transTypes, accounts, transCats, formData]);

  return (
    <div className="transaction-form-wrapper">
      <Form
        title="Transaction Form"
        onSubmit={handleSubmit}
        loading={loading}
        message={message}
        onMessageClose={() => setMessage({ type: "", text: "" })}
        onGoBack={handleGoBack}
        showGoBack={true}
        className="transaction-form-container"
        onFieldChange={handleFieldChange}
        initialValues={formData}
      >
        <FormItem
          label="ID"
          name="strId"
          rules={[{ required: true }]}
        >
          <Input disabled />
        </FormItem>

        <FormItem
          label="Amount"
          name="floatAmount"
          rules={[{ required: true }]}
        >
          <Input 
            type="text"
            placeholder="Enter amount (e.g., 1539.92)"
          />
        </FormItem>

        <FormItem
          label="Account"
          name="strAccount"
          rules={[{ required: true }]}
        >
          <HelpDropdown
            options={accounts}
            placeholder="Select an Account"
            searchPlaceholder="Search accounts..."
            isLoading={loading}
          />
        </FormItem>

        {/* Double Entry Toggle - moved here after first account */}
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

        {isDoubleEntry && (
          <FormItem
            label="Second Account"
            name="strAccount2"
            rules={[{ required: true }]}
          >
            <HelpDropdown
              options={accounts2}
              placeholder="Select 2nd Account"
              searchPlaceholder="Search accounts..."
              isLoading={loading}
            />
          </FormItem>
        )}

        <FormItem
          label="Transaction Type"
          name="strTransType"
          rules={[{ required: true }]}
        >
          <HelpDropdown
            options={transTypes}
            placeholder="Select a type"
            searchPlaceholder="Search transaction types..."
            isLoading={loading}
          />
        </FormItem>

        <FormItem
          label="Category"
          name="strTransCat"
          rules={[{ required: true }]}
        >
          <HelpDropdown
            options={transCats}
            placeholder={
              !formData.strTransType 
                ? "Select transaction type first" 
                : isTransCatLoading 
                  ? "Loading categories..." 
                  : "Select a category"
            }
            searchPlaceholder="Search categories..."
            isLoading={isTransCatLoading}
          />
        </FormItem>

        <FormItem
          label="Reason"
          name="strName"
          rules={[{ required: true }, { minLength: 2 }, { maxLength: 200 }]}
        >
          <Input 
            placeholder="Enter transaction reason"
          />
        </FormItem>
      </Form>
    </div>
  );
}

export default TransactionForm;
