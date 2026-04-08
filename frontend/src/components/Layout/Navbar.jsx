import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userName = "Rahul Sharma", roleLabel = "Employee" }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    if(user?.role) {
      navigate(`/${user.role}/settings`);
    }
  };

  const displayName = user?.name || userName;
  const displayRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : roleLabel;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=EFF6FF&color=2563EB&bold=true`;

  return (
    <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 fixed top-0 right-0 left-[260px] z-10 font-sans">
      <div className="relative w-96 hidden sm:block">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search across reports, tasks..." 
          className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
        />
      </div>
      <div className="flex items-center gap-6 ml-auto">
        <button className="relative text-gray-500 hover:text-gray-900 transition-colors duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        <div className="h-6 w-px bg-gray-200"></div>
        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200 text-left"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img src={avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm" />
            <div className="hidden flex-col items-start lg:flex">
              <span className="text-[13px] font-semibold text-gray-900 leading-none">{displayName}</span>
              <span className="text-[11px] text-gray-500 mt-1">{displayRole}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-1 hidden sm:block" />
          </button>
          
          <div className="flex items-center gap-3 ml-4">
              <button 
                onClick={handleSettings}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4 mr-1.5" />
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Log Out
              </button>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
              <button 
                onClick={handleSettings}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
              >
                <Settings className="w-4 h-4 mr-2 text-gray-500" />
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2 text-red-500" />
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
