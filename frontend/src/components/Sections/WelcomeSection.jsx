// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Welcome heading and action buttons

import React from 'react';
import { Download } from 'lucide-react';

const WelcomeSection = ({ userName, loading }) => {
  return (
    <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left w-full">
      {loading ? (
        <div className="space-y-2">
          <div className="animate-pulse h-7 bg-border-default rounded w-64"></div>
          <div className="animate-pulse h-4 bg-border-subtle rounded w-48"></div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Welcome back, {userName?.split(' ')[0] || 'User'} 👋
          </h2>
          <p className="text-sm text-text-secondary mt-1">Here's your professional overview for the current cycle.</p>
        </div>
      )}
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-accent text-white text-xs font-medium rounded-[7px] hover:bg-accent-hover transition-all duration-150 cursor-pointer flex items-center gap-2 flex-shrink-0">
          <Download className="w-3.5 h-3.5" />
          Export Report
        </button>
      </div>
    </section>
  );
};

export default WelcomeSection;
