import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Form from "../Form";
import "./RefMasExpenseForm.css";

function RefMasExpenseForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [fields, setFields] = useState([
    {
      name: "strId",
      label: "ID",
      type: "text",
      disabled: true,
      rules: { required: true }
    },
    {
      name: "strName",
      label: "Name",
      type: "text",
      rules: { required: true, minLength: 2, maxLength: 100 }
    }
  ]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleGoBack = () => {
    navigate("/home/ref-expense");
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await Axios.post(
        `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-expense/add`,
        formData
      );
      
      console.log("Response:", response.data);
      showMessage("success", "Successfully saved");
      
      // Navigate back to list after a short delay
      setTimeout(() => {
        navigate("/home/ref-expense");
      }, 1500);
      
    } catch (error) {
      console.error("Error:", error.response);
      showMessage("error", error.response?.data?.error?.detail || "Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  const getSequence = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-expense/getSequence`
      );
      
      console.log("Sequence response:", response.data);
      
      // Update the ID field with the sequence value
      setFields(prevFields => 
        prevFields.map(field => 
          field.name === "strId" 
            ? { ...field, defaultValue: response.data.output_value.toString() }
            : field
        )
      );
      
    } catch (error) {
      console.error("Error fetching sequence:", error);
      showMessage("error", "Failed to get sequence number");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSequence();
  }, []);

  return (
    <Form
      title="Expense Master Form"
      fields={fields}
      onSubmit={handleSubmit}
      loading={loading}
      message={message}
      onMessageClose={() => setMessage({ type: "", text: "" })}
      onGoBack={handleGoBack}
      showGoBack={true}
      className="expense-form-wrapper"
    />
  );
}

export default RefMasExpenseForm;
