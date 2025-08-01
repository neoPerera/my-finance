import React, { useState, useRef, useEffect } from 'react';
import './HelpDropdown.css';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Button } from "antd";

/**
 * @param {{
 *   value?: any,
 *   onChange?: (value: any) => void,
 *   disabled?: boolean,
 *   items: { value: any, [key: string]: any }[],
 *   headers: string[],
 *   keys: string[],
 * }} props
 */
const ItemDropdown = ({
  value,
  onChange,
  onSelect,
  disabled = false,
  items = [],
  headers = ['Key', 'Name'],
  keys = ['value', 'label']
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredItems = items.filter((item) =>
    keys.some(k =>
      String(item[k] || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemSelect = (item) => {
    onSelect(item);
    onChange?.(item.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getDisplayValue = () => {
    const found = items.find((item) => item.value === value);
    return found ? found[keys[1]] : 'Select an item';
  };

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <Button
        type="button"
        className="dropdown-toggle"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={`dropdown-text ${!value ? 'placeholder' : ''}`}>
          {getDisplayValue()}
        </span>
        <ChevronDown size={16} className="dropdown-icon" />
      </Button>

      {isOpen && (
        <div className="dropdown-panel">
          <div className="dropdown-search-wrapper">
            <Search size={14} className="dropdown-search-icon" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dropdown-search-input"
            />
          </div>

          {filteredItems.length === 0 ? (
            <div className="dropdown-no-items">No items found</div>
          ) : (
            <>
              <div className="dropdown-grid header">
                {headers.map((h, idx) => (
                  <div key={idx} className="col">{h}</div>
                ))}
              </div>
              <div className="dropdown-scroll">
                {filteredItems.map((item) => (
                  <div
                    key={item.value}
                    className="dropdown-grid item"
                    onClick={() => handleItemSelect(item)}
                  >
                    {keys.map((k, idx) => (
                      <div key={idx} className="col">{item[k]}</div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemDropdown;
