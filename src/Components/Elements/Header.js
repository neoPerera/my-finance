import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ collapsed, setCollapsed, MenuItemClicked, onToggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Enhanced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userWrapper = document.querySelector('.user-wrapper');
      const notificationWrapper = document.querySelector('.notification-wrapper');
      
      if (userWrapper && !userWrapper.contains(event.target)) {
        setShowUserMenu(false);
      }
      
      if (notificationWrapper && !notificationWrapper.contains(event.target)) {
        setShowNotificationMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
        setShowNotificationMenu(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      setCollapsed(!collapsed);
    }
  }, [onToggleSidebar, setCollapsed, collapsed]);

  const handleUserMenuClick = useCallback(() => {
    setShowUserMenu(!showUserMenu);
    setShowNotificationMenu(false);
  }, [showUserMenu]);

  const handleNotificationClick = useCallback(() => {
    setShowNotificationMenu(!showNotificationMenu);
    setShowUserMenu(false);
  }, [showNotificationMenu]);

  const handleLogout = useCallback(() => {
    console.log("Logout button clicked - Direct logout");
    
    // Clear all authentication data
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("username");
    localStorage.removeItem("lastLoginTime");
    sessionStorage.clear();
    
    console.log("LocalStorage cleared, navigating to login");
    
    // Close the user menu
    setShowUserMenu(false);
    
    // Navigate directly to login
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <header className="header">
      <div className="header-content">
        <button 
          className="sidebar-toggle" 
          onClick={handleToggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={!collapsed}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>

        <div className="header-actions">
          <div className="notification-wrapper">
            <button 
              className="notification-btn" 
              onClick={handleNotificationClick}
              aria-label="Notifications"
              aria-expanded={showNotificationMenu}
              aria-haspopup="true"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              {notificationCount > 0 && (
                <span className="notification-badge" aria-label={`${notificationCount} notifications`}>
                  {notificationCount}
                </span>
              )}
            </button>
            
            {showNotificationMenu && (
              <div 
                className="dropdown-menu notification-menu"
                role="menu"
                aria-label="Notifications menu"
              >
                <div className="dropdown-item" role="menuitem">
                  No notifications
                </div>
              </div>
            )}
          </div>

          <div className="user-wrapper">
            <button 
              className="user-btn" 
              onClick={handleUserMenuClick}
              aria-label="User menu"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
            
            {showUserMenu && (
              <div 
                className="dropdown-menu user-menu"
                role="menu"
                aria-label="User menu"
              >
                <div 
                  className="dropdown-item" 
                  onClick={handleLogout}
                  role="menuitem"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleLogout();
                    }
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  Log out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 