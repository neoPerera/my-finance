import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import HelpDropdown from "../../../../Elements/imports/HelpDropdown";
import "./TransactionForm.css";

const SubmitButton = ({ form, onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="submit-btn"
    >
      Submit
    </button>
  );
};



function TransactionForm() {
  const [formData, setFormData] = useState({
    strId: "",
    floatAmount: "",
    strName: "",
    strTransType: "",
    strTransCat: "",
    strAccount: "",
    isDoubleEntry: false,
    strAccount2: "",
  });
  const [transTypes, setTransTypes] = useState([]);
  const [isTransCatDisabled, setTransCatDisabled] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [accounts2, setAccounts2] = useState([]);
  const [transCats, setTransCats] = useState([]);
  const [spinning, setSpinning] = React.useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [reloeadCompoenet, setReloadCompoenet] = useState(0);
  const navigate = useNavigate();

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: "",
      });
    }
    clearMessages();
  };

  const Amount_handleInputChange = (e) => {
    const inputValue = e.target.value;
    
    // Allow only numbers, decimal point, and commas
    const cleanValue = inputValue.replace(/[^0-9.,]/g, "");
    
    // Handle multiple decimal points - keep only the first one
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      const firstPart = parts[0];
      const remainingParts = parts.slice(1).join('');
      const processedValue = firstPart + '.' + remainingParts;
      
      setFormData({
        ...formData,
        floatAmount: processedValue,
      });
    } else {
      setFormData({
        ...formData,
        floatAmount: cleanValue,
      });
    }
    
    if (errors.floatAmount) {
      setErrors({
        ...errors,
        floatAmount: "",
      });
    }
    clearMessages();
  };

  const handleSelectCats = (value) => {
    setFormData({ ...formData, strTransCat: value });
    if (errors.strTransCat) {
      setErrors({
        ...errors,
        strTransCat: "",
      });
    }
    clearMessages();
  };

  const handleSelectAccount = (value) => {
    setFormData({ ...formData, strAccount: value });
    generateAccount2(formData.isDoubleEntry, value);
    
    if (errors.strAccount) {
      setErrors({
        ...errors,
        strAccount: "",
      });
    }
    clearMessages();
  };

  const handleSelectAccount2 = (value) => {
    setFormData({ ...formData, strAccount2: value });
    if (errors.strAccount2) {
      setErrors({
        ...errors,
        strAccount2: "",
      });
    }
    clearMessages();
  };

  const isDouleEntryChange = (value) => {
    setFormData({ ...formData, isDoubleEntry: value });
    generateAccount2(value, formData.strAccount);
    clearMessages();
  };

  const generateAccount2 = (value, strAccount) => {
    if (value) {
      const filteredAccounts = accounts.filter(
        (acc) => acc.value !== strAccount
      );
      setAccounts2(filteredAccounts);
    } else {
      setAccounts2([]); // Empty the list when double entry is off
    }
  };

  const handleSelectTrans = async (value) => {
    console.log(value);
    var strTransCatURL = "";
    if (value == "INC") {
      strTransCatURL = "main/reference/ref-income/getincome";
    } else if (value == "EXP") {
      strTransCatURL = "main/reference/ref-expense/getexpense";
    }
    setFormData({ ...formData, strTransType: value });
    setSpinning(true);
    try {
      const response = await Axios.get(
        `${window.env?.REACT_APP_API_URL}${strTransCatURL}`
      );
      console.log(response);
      setTransCats(
        response.data.map((item) => ({
          label: item.str_name,
          value: item.key,
        }))
      );
      setSpinning(false);
      setTransCatDisabled(false);
    } catch (error) {
      console.error("Error:", error);
      setSpinning(false);
      setErrorMessage("Failed to load transaction categories. Please try again.");
    }
    
    if (errors.strTransType) {
      setErrors({
        ...errors,
        strTransType: "",
      });
    }
    clearMessages();
  };

  const validateForm = () => {
    const newErrors = {};
    const filteredFormData = { ...formData };

    // If isDouble is false, remove account2 from the check
    if (!filteredFormData.isDoubleEntry) {
      delete filteredFormData.strAccount2;
    }

    // Validate required fields
    if (!filteredFormData.strId || filteredFormData.strId.trim() === "") {
      newErrors.strId = "ID is required";
    }

    if (!filteredFormData.floatAmount || filteredFormData.floatAmount.trim() === "") {
      newErrors.floatAmount = "Amount is required";
    } else {
      // Validate amount format
      const amountValue = parseFloat(filteredFormData.floatAmount.replace(/[^0-9.]/g, ""));
      if (isNaN(amountValue) || amountValue <= 0) {
        newErrors.floatAmount = "Please enter a valid amount greater than 0";
      }
    }

    if (!filteredFormData.strAccount || filteredFormData.strAccount.trim() === "") {
      newErrors.strAccount = "Account selection is required";
    }

    if (!filteredFormData.strTransType || filteredFormData.strTransType.trim() === "") {
      newErrors.strTransType = "Transaction type is required";
    }

    if (!filteredFormData.strTransCat || filteredFormData.strTransCat.trim() === "") {
      newErrors.strTransCat = "Category is required";
    }

    if (!filteredFormData.strName || filteredFormData.strName.trim() === "") {
      newErrors.strName = "Reason is required";
    }

    // Validate second account if double entry is enabled
    if (filteredFormData.isDoubleEntry) {
      if (!filteredFormData.strAccount2 || filteredFormData.strAccount2.trim() === "") {
        newErrors.strAccount2 = "Second account is required for double entry";
      } else if (filteredFormData.strAccount2 === filteredFormData.strAccount) {
        newErrors.strAccount2 = "Second account must be different from the first account";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitBtn = async (e) => {
    e.preventDefault();
    clearMessages();
    
    if (!validateForm()) {
      setErrorMessage("Please correct the errors below before submitting.");
      return;
    }

    const filteredFormData = { ...formData };

    // If isDouble is false, remove account2 from the check
    if (!filteredFormData.isDoubleEntry) {
      delete filteredFormData.strAccount2;
    }

    setSpinning(true);
    try {
      const response = await Axios.post(
        `${window.env?.REACT_APP_API_URL}main/transaction/add`,
        filteredFormData
      );
      console.log("Response:", response.data);
      
      setSuccessMessage("Transaction saved successfully!");
      setSpinning(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          strId: "",
          floatAmount: "",
          strName: "",
          strTransType: "",
          strTransCat: "",
          strAccount: "",
          isDoubleEntry: false,
          strAccount2: "",
        });
        setErrors({});
        setSuccessMessage("");
        setReloadCompoenet(reloeadCompoenet + 1);
      }, 2000);
      
    } catch (error) {
      console.error("Error:", error.response);
      setSpinning(false);
      
      if (error.response?.data?.error?.detail) {
        setErrorMessage(error.response.data.error.detail);
      } else if (error.response?.status === 500) {
        setErrorMessage("Server error. Please try again later.");
      } else if (error.response?.status === 400) {
        setErrorMessage("Invalid data. Please check your input.");
      } else if (error.code === 'NETWORK_ERROR') {
        setErrorMessage("Network error. Please check your connection.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    const getSequence = async () => {
      console.log("Getting Inc Seq");
      setSpinning(true);
      try {
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}main/transaction/getsequence?type=id`
        );
        console.log(response);
        setSpinning(false);
        setFormData({
          ...formData,
          strId: response.data.sequence_id.toString(),
        });

        setTransTypes(response.data.trans_types[0]);
        setAccounts(response.data.accounts[0]);
      } catch (error) {
        console.error("Error:", error);
        setSpinning(false);
        setErrorMessage("Failed to load initial data. Please refresh the page.");
      }
    };

    getSequence();
  }, [reloeadCompoenet]);

  const isFormValid = () => {
    const requiredFields = ['strId', 'floatAmount', 'strName', 'strTransType', 'strTransCat', 'strAccount'];
    if (formData.isDoubleEntry) {
      requiredFields.push('strAccount2');
    }
    
    return requiredFields.every(field => formData[field] && formData[field] !== "");
  };

  return (
    <div className="transaction-form-container">
      <div className="form-header">
        <h2>Transaction Form</h2>
        <p>Add a new transaction to your financial records</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="error-message-global">
          <span className="error-icon">✕</span>
          {errorMessage}
        </div>
      )}

      {spinning ? (
        <div className="form-loading">
          <div className="form-loading-spinner"></div>
        </div>
      ) : (
        <form className="transaction-form" onSubmit={handleSubmitBtn}>
          <div className="form-grid">
            {/* ID Field */}
            <div className="form-group">
              <label htmlFor="strId" className="form-label">
                ID <span className="required">*</span>
              </label>
              <input
                type="text"
                id="strId"
                className={`form-input ${errors.strId ? 'error' : ''}`}
                value={formData.strId}
                onChange={handleInputChange}
                disabled={true}
                placeholder="Auto-generated ID"
              />
              {errors.strId && <span className="error-message">{errors.strId}</span>}
            </div>

            {/* Amount Field */}
            <div className="form-group">
              <label htmlFor="floatAmount" className="form-label">
                Amount <span className="required">*</span>
              </label>
              <input
                type="text"
                id="floatAmount"
                className={`form-input ${errors.floatAmount ? 'error' : ''}`}
                value={formData.floatAmount}
                onChange={Amount_handleInputChange}
                placeholder="Enter amount (e.g., 1539.92)"
              />
              {errors.floatAmount && <span className="error-message">{errors.floatAmount}</span>}
            </div>

            {/* Account Selection */}
            <div className="form-group">
              <label htmlFor="strAccount" className="form-label">
                Account <span className="required">*</span>
              </label>
              <HelpDropdown
                options={accounts}
                value={formData.strAccount}
                onChange={handleSelectAccount}
                placeholder="Select an Account"
                searchPlaceholder="Search accounts..."
                className={errors.strAccount ? 'error' : ''}
              />
              {errors.strAccount && <span className="error-message">{errors.strAccount}</span>}
            </div>

            {/* Double Entry Toggle */}
            <div className="form-group">
              <label className="form-label">Double Entry</label>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.isDoubleEntry}
                    onChange={(e) => isDouleEntryChange(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">
                  {formData.isDoubleEntry ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Second Account (Conditional) */}
            {formData.isDoubleEntry && (
              <div className="form-group">
                <label htmlFor="strAccount2" className="form-label">
                  Second Account <span className="required">*</span>
                </label>
                <HelpDropdown
                  options={accounts2}
                  value={formData.strAccount2}
                  onChange={handleSelectAccount2}
                  placeholder="Select 2nd Account"
                  searchPlaceholder="Search accounts..."
                  className={errors.strAccount2 ? 'error' : ''}
                />
                {errors.strAccount2 && <span className="error-message">{errors.strAccount2}</span>}
              </div>
            )}

            {/* Transaction Type */}
            <div className="form-group">
              <label htmlFor="strTransType" className="form-label">
                Transaction Type <span className="required">*</span>
              </label>
              <HelpDropdown
                options={transTypes}
                value={formData.strTransType}
                onChange={handleSelectTrans}
                placeholder="Select a type"
                searchPlaceholder="Search transaction types..."
                className={errors.strTransType ? 'error' : ''}
              />
              {errors.strTransType && <span className="error-message">{errors.strTransType}</span>}
            </div>

            {/* Transaction Category */}
            <div className="form-group">
              <label htmlFor="strTransCat" className="form-label">
                Category <span className="required">*</span>
              </label>
              <HelpDropdown
                options={transCats}
                value={formData.strTransCat}
                onChange={handleSelectCats}
                placeholder="Select a category"
                searchPlaceholder="Search categories..."
                className={errors.strTransCat ? 'error' : ''}
                disabled={isTransCatDisabled}
              />
              {errors.strTransCat && <span className="error-message">{errors.strTransCat}</span>}
            </div>

            {/* Reason Field */}
            <div className="form-group full-width">
              <label htmlFor="strName" className="form-label">
                Reason <span className="required">*</span>
              </label>
              <input
                type="text"
                id="strName"
                className={`form-input ${errors.strName ? 'error' : ''}`}
                value={formData.strName}
                onChange={handleInputChange}
                placeholder="Enter transaction reason"
              />
              {errors.strName && <span className="error-message">{errors.strName}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <SubmitButton 
              onClick={handleSubmitBtn} 
              disabled={!isFormValid() || spinning}
            />
          </div>
        </form>
      )}
    </div>
  );
}

export default TransactionForm;
