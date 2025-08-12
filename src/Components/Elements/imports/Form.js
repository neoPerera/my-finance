import React, { useState, useEffect } from "react";
import "./Form.css";

const Form = ({
  title,
  fields = [],
  onSubmit,
  loading = false,
  message = { type: "", text: "" },
  onMessageClose,
  onGoBack,
  showGoBack = false,
  onFieldChange,
  className = "",
  ...props
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Initialize form data
  useEffect(() => {
    const initialData = {};
    fields.forEach(field => {
      initialData[field.name] = field.defaultValue || "";
    });
    setFormData(initialData);
  }, [fields]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Call onFieldChange if provided
    if (onFieldChange) {
      onFieldChange(name, value);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const validateField = (name, value, rules = {}) => {
    if (rules.required && (!value || value.trim() === "")) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be no more than ${rules.maxLength} characters`;
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.patternMessage || `${name.charAt(0).toUpperCase() + name.slice(1)} format is invalid`;
    }
    
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name], field.rules);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleBlur = (name) => {
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
    
    const error = validateField(name, formData[name], fields.find(f => f.name === name)?.rules);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const renderField = (field) => {
    const {
      name,
      label,
      type = "text",
      placeholder,
      disabled = false,
      required = false,
      options = [],
      rows = 4,
      ...fieldProps
    } = field;

    const fieldError = errors[name];
    const isTouched = touched[name];
    const showError = isTouched && fieldError;

    const commonProps = {
      id: name,
      name: name,
      value: formData[name] || "",
      onChange: (e) => handleInputChange(name, e.target.value),
      onBlur: () => handleBlur(name),
      disabled: disabled,
      className: `form-input ${showError ? 'error' : ''} ${disabled ? 'disabled' : ''}`,
      placeholder: placeholder || `Enter ${label.toLowerCase()}`,
      ...fieldProps
    };

    switch (type) {
      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={rows}
          />
        );

      case "select":
        return (
          <select {...commonProps}>
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "number":
        return (
          <input
            {...commonProps}
            type="number"
            min={fieldProps.min}
            max={fieldProps.max}
            step={fieldProps.step}
          />
        );

      case "email":
        return (
          <input
            {...commonProps}
            type="email"
          />
        );

      case "password":
        return (
          <input
            {...commonProps}
            type="password"
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type="text"
          />
        );
    }
  };

  return (
    <div className={`form-container ${className}`} {...props}>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
          {onMessageClose && (
            <button 
              className="message-close" 
              onClick={onMessageClose}
              type="button"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="form-header">
        <h2>{title}</h2>
        {showGoBack && onGoBack && (
          <button
            type="button"
            className="btn btn-outline btn-sm go-back-btn"
            onClick={onGoBack}
            disabled={loading}
          >
            <span className="btn-icon">←</span>
            Go Back
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-fields">
          {fields.map((field, index) => (
            <div key={field.name || index} className="form-field">
              <label htmlFor={field.name} className="form-label">
                {field.label}
                {field.rules?.required && <span className="required">*</span>}
              </label>
              
              {renderField(field)}
              
              {touched[field.name] && errors[field.name] && (
                <div className="error-message">
                  {errors[field.name]}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <span className="btn-icon">✓</span>
                Save
              </>
            )}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setFormData({});
              setErrors({});
              setTouched({});
            }}
            disabled={loading}
          >
            <span className="btn-icon">↺</span>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
