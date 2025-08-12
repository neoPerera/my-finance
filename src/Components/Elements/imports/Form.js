import React, { useState, useEffect, createContext, useContext } from "react";
import "./Form.css";

// Create context for form state
const FormContext = createContext();

// Custom hook to use form context
export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a Form component');
  }
  return context;
};

// Basic Input component
export const Input = ({ 
  value = "", 
  onChange, 
  onBlur, 
  type = "text",
  placeholder = "",
  disabled = false,
  className = "",
  error = false,
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleBlurEvent = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      onBlur={handleBlurEvent}
      placeholder={placeholder}
      disabled={disabled}
      className={`form-input ${error ? 'error' : ''} ${className}`}
      {...props}
    />
  );
};

// TextArea component
export const TextArea = ({ 
  value = "", 
  onChange, 
  onBlur, 
  placeholder = "",
  disabled = false,
  className = "",
  error = false,
  rows = 4,
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleBlurEvent = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      onBlur={handleBlurEvent}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={`form-input ${error ? 'error' : ''} ${className}`}
      {...props}
    />
  );
};

// Select component
export const Select = ({ 
  value = "", 
  onChange, 
  onBlur, 
  placeholder = "Select an option...",
  disabled = false,
  className = "",
  error = false,
  options = [],
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleBlurEvent = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      onBlur={handleBlurEvent}
      disabled={disabled}
      className={`form-input ${error ? 'error' : ''} ${className}`}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Form.Item component
export const FormItem = ({ 
  label, 
  name, 
  rules = [], 
  children, 
  required = false,
  className = "",
  ...props 
}) => {
  const { formData, errors, touched, handleInputChange, handleBlur, validateField } = useForm();
  
  const fieldError = errors[name];
  const isTouched = touched[name];
  const showError = isTouched && fieldError;
  const value = formData[name] || "";

  const handleChange = (newValue) => {
    handleInputChange(name, newValue);
  };

  const handleFieldBlur = () => {
    handleBlur(name);
  };

  // Check if the child is a custom component (not a basic input)
  const isCustomComponent = children.type && 
    (children.type.name === 'HelpDropdown' || 
     children.type.displayName === 'HelpDropdown' ||
     typeof children.type === 'function' && children.type.name !== 'Input' && 
     children.type.name !== 'TextArea' && children.type.name !== 'Select');

  // Clone child and inject props
  const childWithProps = React.cloneElement(children, {
    value: value,
    onChange: handleChange,
    onBlur: handleFieldBlur,
    error: showError,
    // Only apply form-input class to basic input components
    className: isCustomComponent 
      ? `${showError ? 'error' : ''} ${className}`.trim()
      : `form-input ${showError ? 'error' : ''} ${className}`.trim(),
    ...props
  });

  return (
    <div className={`form-item ${showError ? 'has-error' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {childWithProps}
        {showError && (
          <div className="error-message">{fieldError}</div>
        )}
      </div>
    </div>
  );
};

// Main Form component
const Form = ({
  title,
  children,
  onSubmit,
  loading = false,
  message = { type: "", text: "" },
  onMessageClose,
  onGoBack,
  showGoBack = false,
  onFieldChange,
  className = "",
  initialValues = {},
  ...props
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update form data when initialValues change
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const validateField = (name, value, rules = []) => {
    for (const rule of rules) {
      if (rule.required && (!value || value.toString().trim() === "")) {
        return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }
      
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rule.minLength} characters`;
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} must be no more than ${rule.maxLength} characters`;
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} format is invalid`;
      }
    }
    
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Get all FormItem children and validate them
    React.Children.forEach(children, (child) => {
      if (child && child.type === FormItem && child.props.name) {
        const { name, rules } = child.props;
        const error = validateField(name, formData[name], rules);
        if (error) {
          newErrors[name] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

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

  const handleBlur = (name) => {
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
    
    // Get the field rules from children
    let fieldRules = [];
    React.Children.forEach(children, (child) => {
      if (child && child.type === FormItem && child.props.name === name) {
        fieldRules = child.props.rules || [];
      }
    });
    
    const error = validateField(name, formData[name], fieldRules);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formContextValue = {
    formData,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    validateField
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <div className={`form-container ${className}`}>
        {/* Form Header */}
        <div className="form-header">
          <h2 className="form-title">{title}</h2>
          {showGoBack && onGoBack && (
            <button 
              type="button" 
              onClick={onGoBack}
              className="go-back-btn btn-outline btn-sm"
            >
              ← Go Back
            </button>
          )}
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`message ${message.type}`}>
            <span>{message.text}</span>
            {onMessageClose && (
              <button 
                type="button" 
                onClick={onMessageClose}
                className="message-close"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-fields">
            {children}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Saving...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </FormContext.Provider>
  );
};

export default Form;
