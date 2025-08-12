import React, { useState, useEffect, useRef } from 'react';
import './HelpDropdown.css';

const HelpDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select an option...",
  isLoading = false,
  className = "",
  searchPlaceholder = "Search...",
  error = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // Handle keyboard navigation (only on desktop)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen || isMobile) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
            handleOptionSelect(filteredOptions[selectedIndex]);
          } else if (filteredOptions.length > 0) {
            handleOptionSelect(filteredOptions[0]);
          }
          break;
        case 'Tab':
          if (event.shiftKey) {
            // Allow normal tab behavior
            return;
          }
          event.preventDefault();
          if (filteredOptions.length > 0) {
            handleOptionSelect(filteredOptions[selectedIndex >= 0 ? selectedIndex : 0]);
          }
          break;
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, filteredOptions, selectedIndex, isMobile]);

  const handleToggle = () => {
    if (!isLoading) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
        setSelectedIndex(-1);
        // Focus search input after modal opens (only on desktop)
        if (!isMobile) {
          setTimeout(() => {
            if (searchInputRef.current) {
              searchInputRef.current.focus();
            }
          }, 100);
        }
      }
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
    setSelectedIndex(-1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedIndex(-1); // Reset selection when searching
  };

  return (
    <>
      <div 
        className={`help-dropdown ${className} ${isLoading ? 'disabled' : ''} ${error ? 'error' : ''}`}
      >
        <div 
          className="dropdown-trigger"
          onClick={handleToggle}
          tabIndex={isLoading ? -1 : 0}
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
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            <svg 
              className="dropdown-arrow" 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div 
            ref={dropdownRef}
            className="modal-content"
          >
            <div className="search-container">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
                autoFocus={!isMobile}
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
                        className={`table-row ${selectedIndex === index ? 'selected' : ''} ${selectedOption?.value === option.value ? 'current-selection' : ''}`}
                        onClick={() => handleOptionSelect(option)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleOptionSelect(option);
                          }
                        }}
                        tabIndex={0}
                        role="option"
                        aria-selected={selectedIndex === index}
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
        </div>
      )}
    </>
  );
};

export default HelpDropdown; 