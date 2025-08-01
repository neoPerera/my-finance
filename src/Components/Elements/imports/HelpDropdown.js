import React, { useState, useEffect, useRef } from 'react';
import './HelpDropdown.css';

const HelpDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select an option...",
  disabled = false,
  className = "",
  searchPlaceholder = "Search..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  // Find selected option based on value
  useEffect(() => {
    if (value && options.length > 0) {
      const found = options.find(option => option.value === value);
      setSelectedOption(found || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  // Filter options based on search term
  const filteredOptions = options.filter(option => {
    const searchLower = searchTerm.toLowerCase();
    return (
      option.value?.toString().toLowerCase().includes(searchLower) ||
      option.label?.toString().toLowerCase().includes(searchLower)
    );
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredOptions.length > 0) {
      handleOptionSelect(filteredOptions[0]);
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={`help-dropdown ${className} ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
    >
      <div 
        className="dropdown-trigger"
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={placeholder}
      >
        <span className="selected-text">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          className="dropdown-arrow" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="search-container">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="search-input"
              autoFocus
            />
          </div>
          
          <div className="options-container">
            {filteredOptions.length > 0 ? (
              <div className="options-table">
                <div className="table-header">
                  <div className="header-cell">Value</div>
                  <div className="header-cell">Description</div>
                </div>
                <div className="table-body">
                  {filteredOptions.map((option, index) => (
                    <div
                      key={option.value || index}
                      className={`table-row ${selectedOption?.value === option.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(option)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOptionSelect(option);
                        }
                      }}
                      tabIndex={0}
                      role="option"
                      aria-selected={selectedOption?.value === option.value}
                    >
                      <div className="table-cell value-cell">{option.value}</div>
                      <div className="table-cell label-cell">{option.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-options">
                {searchTerm ? 'No options found' : 'No options available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpDropdown; 