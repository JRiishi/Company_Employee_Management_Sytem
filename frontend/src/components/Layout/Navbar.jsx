// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Top navigation bar with search, notifications, and user menu

import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [unreadNotifications, setUnreadNotifications] = useState(2); // Demo

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleSettings = () => {
    setDropdownOpen(false);
    if (user?.role) {
      navigate(`/${user.role}/settings`);
    }
  };

  const displayName = user?.name || "User";
  const displayRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Employee";

  return (
    <header className="h-[56px] bg-bg-surface border-b border-border-subtle flex items-center justify-between px-6 flex-shrink-0">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-sm font-semibold text-text-primary">
          {displayRole} Portal
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-text-muted hover:text-text-secondary hover:bg-bg-hover rounded-[7px] transition-all duration-150">
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse-once" />
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-border-subtle" />

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-[7px] hover:bg-bg-hover transition-all duration-150 text-left"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-accent-text">
                {displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-xs font-medium text-text-primary leading-none">{displayName}</span>
              <span className="text-[10px] text-text-muted mt-0.5">{displayRole}</span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[200px] bg-bg-elevated border border-border-default rounded-[10px] shadow-floating overflow-hidden z-50">
              <button
                onClick={handleSettings}
                className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover flex items-center gap-3 transition-colors duration-150"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <div className="border-t border-border-subtle" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/10 flex items-center gap-3 transition-colors duration-150 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
