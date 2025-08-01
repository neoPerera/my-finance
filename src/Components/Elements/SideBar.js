import React, { useState, useEffect, useCallback } from "react";
import "./SideBar.css";

const SideBar = ({ collapsed, MenuItemClicked, sideBarFormData, isMobileExpanded, setIsMobileExpanded }) => {
  const [expandedMenus, setExpandedMenus] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [dropdownMenu, setDropdownMenu] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState(null);

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
    }
  }, [isMobile, isMobileExpanded, setIsMobileExpanded, dropdownMenu]);

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
        }
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isMobile, isMobileExpanded, setIsMobileExpanded, dropdownMenu]);

  const handleMenuClick = useCallback((item) => {
    if (item.props?.link) {
      MenuItemClicked({ item });
      // Set active menu item
      setActiveMenuItem(item.key);
      // Close mobile sidebar after navigation
      if (isMobile) {
        setIsMobileExpanded(false);
      }
      // Close dropdown after navigation
      setDropdownMenu(null);
    }
  }, [MenuItemClicked, isMobile, setIsMobileExpanded]);

  const toggleMenuExpansion = useCallback((menuKey) => {
    setExpandedMenus(prev => {
      const newExpandedMenus = new Set(prev);
      if (newExpandedMenus.has(menuKey)) {
        newExpandedMenus.delete(menuKey);
      } else {
        newExpandedMenus.add(menuKey);
      }
      return newExpandedMenus;
    });
  }, []);

  const handleOverlayClick = useCallback(() => {
    setIsMobileExpanded(false);
  }, [setIsMobileExpanded]);

  const handleCollapsedMenuClick = useCallback((event, item) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Collapsed menu click:', item);
    console.log('Item children:', item.children);
    
    if (item.children && item.children.length > 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      console.log('Menu rect:', rect);
      
      // Calculate better positioning to avoid cutoff
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let x = rect.right + 8;
      let y = rect.top;
      
      // Adjust if dropdown would go off-screen
      if (x + 280 > viewportWidth) { // 280px is max-width of dropdown
        x = rect.left - 288; // Position to the left of the sidebar
      }
      
      if (y + 400 > viewportHeight) { // Estimate max height
        y = Math.max(10, viewportHeight - 410);
      }
      
      // Ensure we have the complete menu structure
      const menuData = {
        item: {
          ...item,
          children: item.children || []
        },
        position: {
          x: x,
          y: y
        }
      };
      
      console.log('Setting dropdown menu data:', menuData);
      setDropdownMenu(menuData);
    } else if (item.props?.link) {
      handleMenuClick(item);
    }
  }, [handleMenuClick]);

  const renderDropdownMenu = useCallback((menuData) => {
    if (!menuData) return null;

    const { item, position } = menuData;
    
    console.log('Rendering dropdown:', item, position);
    console.log('Item children in render:', item.children);
    
    const renderDropdownItem = (menuItem, level = 0) => {
      const hasChildren = menuItem.children && menuItem.children.length > 0;
      
      console.log(`Rendering dropdown item level ${level}:`, menuItem.label, 'hasChildren:', hasChildren);
      
      // Folder icon component for dropdown
      const DropdownFolderIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8 }}>
          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
        </svg>
      );
      
      return (
        <div
          key={`${menuItem.key}-${level}`}
          className={`dropdown-item dropdown-level-${level} ${activeMenuItem === menuItem.key ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            if (hasChildren) {
              // Toggle expansion for items with children
              const isExpanded = expandedMenus.has(menuItem.key);
              console.log(`Toggling expansion for ${menuItem.label}, currently expanded:`, isExpanded);
              if (isExpanded) {
                setExpandedMenus(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(menuItem.key);
                  return newSet;
                });
              } else {
                setExpandedMenus(prev => {
                  const newSet = new Set(prev);
                  newSet.add(menuItem.key);
                  return newSet;
                });
              }
            } else {
              // Navigate for items without children
              console.log(`Navigating to:`, menuItem.props?.link);
              handleMenuClick(menuItem);
            }
          }}
        >
          {hasChildren ? (
            <span className="dropdown-icon">
              <DropdownFolderIcon />
            </span>
          ) : (
            menuItem.icon && <span className="dropdown-icon">{menuItem.icon}</span>
          )}
          <span className="dropdown-label">{menuItem.label}</span>
          {hasChildren && (
            <span className={`dropdown-expand-icon ${expandedMenus.has(menuItem.key) ? 'expanded' : ''}`}>
              ▶
            </span>
          )}
        </div>
      );
    };

    const renderNestedItems = (menuItems, level = 0) => {
      if (!menuItems || menuItems.length === 0) {
        console.log(`No menu items at level ${level}`);
        return null;
      }
      
      console.log(`Rendering ${menuItems.length} items at level ${level}:`, menuItems.map(item => item.label));
      
      return menuItems.map(item => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.has(item.key);
        
        console.log(`Item ${item.label} at level ${level}: hasChildren=${hasChildren}, isExpanded=${isExpanded}`);
        
        return (
          <div key={`${item.key}-${level}`}>
            {renderDropdownItem(item, level)}
            {hasChildren && isExpanded && (
              <div className="dropdown-nested-items">
                {renderNestedItems(item.children, level + 1)}
              </div>
            )}
          </div>
        );
      });
    };
    
    return (
      <div 
        className="sidebar-dropdown"
        style={{
          left: position.x,
          top: position.y
        }}
        onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing when clicked inside
      >
        <div className="dropdown-header">
          <span className="dropdown-title">{item.label}</span>
        </div>
        <div className="dropdown-items">
          {renderNestedItems(item.children || [])}
        </div>
      </div>
    );
  }, [handleMenuClick, expandedMenus]);

  const renderMenuItem = useCallback((item, level = 0) => {
    if (item.children && item.children.length > 0) {
      const isExpanded = expandedMenus.has(item.key);
      
      // Folder icon component
      const FolderIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: collapsed ? '0' : '12px', opacity: 0.8 }}>
          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
        </svg>
      );
      
      return (
        <div key={item.key} className={`menu-group menu-level-${level}`}>
          <div 
            className="menu-group-header"
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
          {sideBarFormData.map(item => renderMenuItem(item))}
        </div>
      </div>

      {/* Dropdown Menu for Collapsed State */}
      {dropdownMenu && renderDropdownMenu(dropdownMenu)}
    </>
  );
};

export default SideBar;
