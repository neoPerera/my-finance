import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Form, { FormItem, Input } from "../../../../../Elements/imports/Form";
import "./RefMasIncomeForm.css";

function RefMasIncomeForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({});

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleGoBack = () => {
    navigate("/home/ref-income");
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await Axios.post(
        `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-income/addincome`,
        formData
      );
      
      console.log("Response:", response.data);
      showMessage("success", "Income saved successfully!");
      
      // Reset form and reload data
      setTimeout(() => {
        getSequence();
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

  const getSequence = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-income/getsequence?type=key`
      );
      
      console.log("Sequence Response:", response.data);
      
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
          key: sequenceId.toString()
        }));
      } else {
        console.warn("No sequence ID found in response:", response.data);
        showMessage("error", "Failed to get sequence number");
      }
      
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
    <Form
      title="Income Form"
      onSubmit={handleSubmit}
      loading={loading}
      message={message}
      onMessageClose={() => setMessage({ type: "", text: "" })}
      onGoBack={handleGoBack}
      showGoBack={true}
      className="income-form-container"
      initialValues={formData}
    >
      <FormItem
        label="Key"
        name="key"
        rules={[{ required: true }]}
      >
        <Input disabled />
      </FormItem>

      <FormItem
        label="Name"
        name="str_name"
        rules={[{ required: true }, { minLength: 2 }, { maxLength: 100 }]}
      >
        <Input 
          placeholder="Enter income name"
        />
      </FormItem>

      <FormItem
        label="Description"
        name="str_description"
        rules={[{ maxLength: 500 }]}
      >
        <Input 
          placeholder="Enter income description (optional)"
        />
      </FormItem>
    </Form>
  );
}

export default RefMasIncomeForm;
