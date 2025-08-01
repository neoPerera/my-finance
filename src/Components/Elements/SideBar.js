import React, { useState, useEffect, useCallback } from "react";
import Loading from "./Loading";
import "./SideBar.css";

const SideBar = ({ collapsed, MenuItemClicked, sideBarFormData, isMobileExpanded, setIsMobileExpanded, isLoading = false }) => {
  const [expandedMenus, setExpandedMenus] = useState(new Set());
  const [dropdownExpandedMenus, setDropdownExpandedMenus] = useState(new Set());
  const [dropdownMenu, setDropdownMenu] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Enhanced mobile and tablet detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Debug dropdown expansion state
  useEffect(() => {
    console.log('Dropdown expanded menus state changed:', Array.from(dropdownExpandedMenus));
  }, [dropdownExpandedMenus]);

  // Enhanced click outside handling with better touch support
  const handleClickOutside = useCallback((event) => {
    if (isMobile && isMobileExpanded) {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      
      if (sidebar && !sidebar.contains(event.target) && 
          overlay && !overlay.contains(event.target)) {
        setIsMobileExpanded(false);
      }
    }
    
    // Close dropdown when clicking outside - but not when clicking inside the dropdown
    if (dropdownMenu && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-dropdown')) {
      setDropdownMenu(null);
      setDropdownExpandedMenus(new Set()); // Clear dropdown expansion state
    }
  }, [isMobile, isMobileExpanded, dropdownMenu]);

  useEffect(() => {
    // Add both mouse and touch events for better mobile support
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Handle escape key to close mobile sidebar and dropdown
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (isMobile && isMobileExpanded) {
          setIsMobileExpanded(false);
        }
        if (dropdownMenu) {
          setDropdownMenu(null);
          setDropdownExpandedMenus(new Set()); // Clear dropdown expansion state
        }
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isMobile, isMobileExpanded, setIsMobileExpanded, dropdownMenu]);

  const handleMenuClick = useCallback((item) => {
    MenuItemClicked(item);
    setActiveMenuItem(item.key);
    if (isMobile) {
      setIsMobileExpanded(false);
    }
    if (dropdownMenu) {
      setDropdownMenu(null);
      setDropdownExpandedMenus(new Set()); // Clear dropdown expansion state
    }
  }, [MenuItemClicked, isMobile, dropdownMenu]);

  const toggleMenuExpansion = useCallback((menuKey) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuKey)) {
        newSet.delete(menuKey);
      } else {
        newSet.add(menuKey);
      }
      return newSet;
    });
  }, []);

  const toggleDropdownMenuExpansion = useCallback((menuKey) => {
    console.log('Toggling dropdown menu expansion for:', menuKey);
    console.log('Current dropdown expanded menus:', Array.from(dropdownExpandedMenus));
    setDropdownExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuKey)) {
        newSet.delete(menuKey);
        console.log('Removed from expanded set:', menuKey);
      } else {
        newSet.add(menuKey);
        console.log('Added to expanded set:', menuKey);
      }
      console.log('New expanded set:', Array.from(newSet));
      return newSet;
    });
  }, [dropdownExpandedMenus]);

  const handleOverlayClick = useCallback(() => {
    setIsMobileExpanded(false);
  }, [setIsMobileExpanded]);

  const handleCollapsedMenuClick = useCallback((event, item) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate position for dropdown
    let x = rect.right + 8; // 8px gap from sidebar
    let y = rect.top;
    
    // Adjust if dropdown would go off-screen
    const dropdownWidth = 250; // Approximate dropdown width
    const dropdownHeight = 400; // Approximate dropdown height
    
    if (x + dropdownWidth > viewportWidth) {
      x = rect.left - dropdownWidth - 8; // Show on left side
    }
    
    if (y + dropdownHeight > viewportHeight) {
      y = viewportHeight - dropdownHeight - 8; // Adjust to fit in viewport
    }
    
    setDropdownMenu({
      item,
      position: { x, y }
    });
  }, []);

  const renderDropdownItem = useCallback((menuItem, level = 0) => {
    const hasChildren = menuItem.children && menuItem.children.length > 0;
    const isExpanded = dropdownExpandedMenus.has(menuItem.key);
    
    console.log('Rendering dropdown item:', menuItem.label, 'hasChildren:', hasChildren, 'isExpanded:', isExpanded, 'level:', level);
    
    const DropdownFolderIcon = () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
      </svg>
    );

    if (hasChildren) {
      return (
        <div key={menuItem.key} className={`dropdown-item dropdown-level-${level}`}>
          <div 
            className="dropdown-item-content"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Clicking on dropdown item with children:', menuItem.label);
              toggleDropdownMenuExpansion(menuItem.key);
            }}
          >
            <DropdownFolderIcon />
            <span className="dropdown-label">{menuItem.label}</span>
            <span className={`dropdown-expand-icon ${isExpanded ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {isExpanded && (
            <div className="dropdown-nested-items">
              {menuItem.children.map(child => renderDropdownItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div 
        key={menuItem.key} 
        className={`dropdown-item dropdown-level-${level} ${activeMenuItem === menuItem.key ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          handleMenuClick(menuItem);
        }}
      >
        <span className="dropdown-icon">{menuItem.icon}</span>
        <span className="dropdown-label">{menuItem.label}</span>
      </div>
    );
  }, [dropdownExpandedMenus, toggleDropdownMenuExpansion, activeMenuItem, handleMenuClick]);

  const renderDropdownMenu = useCallback((dropdownData) => {
    const { item, position } = dropdownData;
    
    return (
      <div 
        className="sidebar-dropdown"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1002
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dropdown-header">
          <span className="dropdown-title">{item.label}</span>
        </div>
        <div className="dropdown-items">
          {item.children && item.children.length > 0 ? (
            item.children.map(child => renderDropdownItem(child, 0))
          ) : (
            <div className="dropdown-item" onClick={() => handleMenuClick(item)}>
              <span className="dropdown-icon">{item.icon}</span>
              <span className="dropdown-label">{item.label}</span>
            </div>
          )}
        </div>
      </div>
    );
  }, [handleMenuClick, renderDropdownItem]);

  const renderMenuItem = useCallback((item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.has(item.key);
    
    const FolderIcon = () => (
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        style={{ marginRight: collapsed ? 0 : '8px' }}
      >
        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
      </svg>
    );

    if (hasChildren) {
      return (
        <div key={item.key} className="menu-group">
          <div
            className={`menu-group-header ${activeMenuItem === item.key ? 'active' : ''}`}
            onClick={(e) => {
              if (collapsed && !isMobile) {
                handleCollapsedMenuClick(e, item);
              } else {
                toggleMenuExpansion(item.key);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (collapsed && !isMobile) {
                  handleCollapsedMenuClick(e, item);
                } else {
                  toggleMenuExpansion(item.key);
                }
              }
            }}
            aria-expanded={isExpanded}
            aria-label={`${item.label} menu`}
          >
            <div className="menu-group-title">
              <FolderIcon />
              {(!collapsed || isMobile) && item.label}
            </div>
            {(!collapsed || isMobile) && (
              <span className={`menu-expand-icon ${isExpanded ? 'expanded' : ''}`}>
                ▼
              </span>
            )}
          </div>
          {isExpanded && (!collapsed || isMobile) && (
            <div className="menu-group-items">
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={item.key}
        className={`menu-item menu-level-${level} ${activeMenuItem === item.key ? 'active' : ''}`}
        onClick={(e) => {
          if (collapsed && !isMobile) {
            handleCollapsedMenuClick(e, item);
          } else {
            handleMenuClick(item);
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (collapsed && !isMobile) {
              handleCollapsedMenuClick(e, item);
            } else {
              handleMenuClick(item);
            }
          }
        }}
        aria-label={item.label}
      >
        {item.icon && <span className="menu-icon">{item.icon}</span>}
        {(!collapsed || isMobile) && <span className="menu-label">{item.label}</span>}
      </div>
    );
  }, [collapsed, isMobile, expandedMenus, toggleMenuExpansion, handleMenuClick, handleCollapsedMenuClick, activeMenuItem]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isMobileExpanded ? 'visible' : ''}`}
          onClick={handleOverlayClick}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`sidebar ${collapsed ? "collapsed" : ""} ${isMobileExpanded ? "expanded" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-content">
          {isLoading ? (
            <div className="sidebar-loading">
              <Loading />
              <p>Loading menu...</p>
            </div>
          ) : (
            sideBarFormData.map(item => renderMenuItem(item))
          )}
        </div>
      </div>

      {/* Dropdown Menu for Collapsed State */}
      {dropdownMenu && renderDropdownMenu(dropdownMenu)}
    </>
  );
};

export default SideBar;
