import React from 'react';
import { Filter, Download } from 'lucide-react';

const WelcomeSection = ({ userName, loading }) => {
  return (
    <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left w-full block relative z-0">
      {loading ? (
        <div>
          <div className="animate-pulse h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-48"></div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome back, {userName?.split(' ')[0] || 'User'} 👋
          </h2>
          <p className="text-[14px] text-gray-500 mt-1">Here's your professional overview for the current cycle.</p>
        </div>
      )}
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 cursor-pointer flex items-center gap-2">
          <Filter className="w-4 h-4"/> Filter Date
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200 cursor-pointer flex items-center gap-2">
          <Download className="w-4 h-4"/> Export Report
        </button>
      </div>
    </section>
  );
};
export default WelcomeSection;
