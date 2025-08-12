import React, { useState, useEffect } from "react";
import "./Table.css";

const Table = ({
  data = [],
  columns = [],
  pageSize = 10,
  searchable = true,
  sortable = true,
  editable = false,
  scrollable = false,
  itemsPerPage = 10,
  onEdit,
  onSave,
  onCancel,
  loading = false,
  emptyMessage = "No data available",
  searchPlaceholder = "Search...",
  className = "",
  ...props
}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [editingKey, setEditingKey] = useState("");
  const [editingData, setEditingData] = useState({});

  // Initialize data
  useEffect(() => {
    setFilteredData(data);
    setTotalItems(data.length);
    setCurrentPage(1);
  }, [data]);

  // Filter and sort data
  useEffect(() => {
    let filtered = [...data];
    
    // Apply search filter
    if (searchTerm && searchable) {
      filtered = filtered.filter(item => {
        return columns.some(col => {
          if (col.searchable === false) return false;
          const value = item[col.dataIndex];
          if (value == null) return false;
          return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }
    
    // Apply sorting
    if (sortField && sortable) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredData(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1); // Reset to first page when filtering
  }, [data, searchTerm, sortField, sortDirection, searchable, sortable, columns]);

  const handleSort = (field) => {
    if (!sortable) return;
    
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageSizeChange = (e) => {
    setCurrentPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalItems / currentPageSize);
  const startIndex = (currentPage - 1) * currentPageSize;
  const endIndex = startIndex + currentPageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Editing functions
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    if (onEdit) {
      onEdit(record);
    } else {
      // Default editing behavior
      const initialData = {};
      columns.forEach(col => {
        if (col.editable) {
          initialData[col.dataIndex] = record[col.dataIndex];
        }
      });
      setEditingData(initialData);
      setEditingKey(record.key);
    }
  };

  const cancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setEditingKey("");
      setEditingData({});
    }
  };

  const save = async (key) => {
    if (onSave) {
      await onSave(key, editingData);
    }
    setEditingKey("");
    setEditingData({});
  };

  const handleInputChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeyPress = (e, key) => {
    if (e.key === 'Enter') {
      save(key);
    } else if (e.key === 'Escape') {
      cancel();
    }
  };

  // Render cell content
  const renderCell = (column, record, index) => {
    const { dataIndex, render, editable: colEditable, inputType = "text" } = column;
    const isEditingRow = isEditing(record);
    const isEditable = editable && colEditable && isEditingRow;

    if (isEditable) {
      return (
        <input
          type={inputType}
          value={editingData[dataIndex] || ''}
          onChange={(e) => handleInputChange(dataIndex, e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, record.key)}
          className="edit-input"
          autoFocus={index === 0}
        />
      );
    }

    if (render) {
      return render(record[dataIndex], record, index);
    }

    return record[dataIndex];
  };

  // Render action buttons
  const renderActions = (record) => {
    const editable = isEditing(record);
    
    if (editable) {
      return (
        <div className="action-buttons">
          <button
            className="btn btn-success btn-sm"
            onClick={() => save(record.key)}
            title="Save changes"
          >
            <span className="btn-icon">✓</span>
            Save
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={cancel}
            title="Cancel editing"
          >
            <span className="btn-icon">✕</span>
            Cancel
          </button>
        </div>
      );
    }

    return (
      <button
        className="btn btn-outline btn-sm"
        disabled={editingKey !== ""}
        onClick={() => edit(record)}
        title="Edit row"
      >
        <span className="btn-icon">✎</span>
        Edit
      </button>
    );
  };

  if (loading) {
    return (
      <div className={`table-wrapper ${className}`} {...props}>
        <div className="table-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`table-wrapper ${className}`} {...props}>
        <div className="table-container">
          <div className="no-data-container">
            <div className="no-data-icon">📊</div>
            <div className="no-data-text">No data available</div>
            <div className="no-data-subtext">Try adjusting your search or filters</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-wrapper ${className}`} {...props}>
      {/* Search and Controls */}
      {(searchable || pageSize !== 10) && (
        <div className="controls-section">
          {searchable && (
            <div className="search-container">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          )}
          
          {pageSize !== 10 && (
            <div className="page-size-control">
              <label>Show:</label>
              <select value={currentPageSize} onChange={handlePageSizeChange} className="page-size-select">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      {totalItems > 0 && (
        <div className="results-summary">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
        </div>
      )}

      <div className="table-container">
        <div className={`table-scroll-container ${scrollable ? 'scrollable' : 'no-scroll'}`}>
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.key || column.dataIndex || index}
                    className={`${sortable && column.sortable !== false ? 'sortable' : ''} ${sortField === column.dataIndex ? sortDirection : ''}`}
                    onClick={() => sortable && column.sortable !== false ? handleSort(column.dataIndex) : null}
                    style={column.width ? { width: column.width } : {}}
                  >
                    {column.title}
                    {sortable && column.sortable !== false && (
                      <span className="sort-icon">▼</span>
                    )}
                  </th>
                ))}
                {editable && (
                  <th className="action-header">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentData.map((record, rowIndex) => (
                <tr key={record.key || rowIndex} className={isEditing(record) ? 'editing-row' : ''}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={column.key || column.dataIndex || colIndex}
                      className={`${column.className || ''} ${column.dataIndex ? `${column.dataIndex}-cell` : ''}`}
                    >
                      {editingKey === record.key && column.editable ? (
                        <input
                          type="text"
                          value={editingData[column.dataIndex] || ''}
                          onChange={(e) => handleInputChange(column.dataIndex, e.target.value)}
                          className="edit-input"
                          autoFocus={colIndex === 0}
                        />
                      ) : (
                        column.render ? column.render(record[column.dataIndex], record, rowIndex) : record[column.dataIndex]
                      )}
                    </td>
                  ))}
                  {editable && (
                    <td className="action-cell">
                      {renderActions(record)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          <div className="pagination-controls">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <span className="btn-icon">⟪</span>
              First
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="btn-icon">‹</span>
              Previous
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
