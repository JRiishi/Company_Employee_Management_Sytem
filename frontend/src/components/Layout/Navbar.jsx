import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';

const Navbar = ({ userName = "Rahul Sharma" }) => {
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
        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200 text-left">
          <img src="https://ui-avatars.com/api/?name=Rahul+Sharma&background=EFF6FF&color=2563EB&bold=true" alt="Avatar" className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm" />
          <div className="hidden flex-col items-start lg:flex">
            <span className="text-[13px] font-semibold text-gray-900 leading-none">{userName}</span>
            <span className="text-[11px] text-gray-500 mt-1">Senior Engineer</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-1 hidden sm:block" />
        </button>
      </div>
    </header>
  );
};
export default Navbar;
