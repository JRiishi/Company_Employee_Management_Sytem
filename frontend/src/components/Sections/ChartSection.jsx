// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Wrapper for performance chart with loading state

import React from 'react';
import PerformanceChart from '../PerformanceChart';
import Card from '../Card/Card';

const ChartSection = ({ performanceData, loading }) => {
  if (loading) {
    return (
      <div className="bg-bg-surface border border-border-subtle rounded-[10px] h-[240px] flex flex-col animate-pulse">
        <div className="px-5 py-4 border-b border-border-subtle">
          <div className="h-4 bg-border-default rounded w-32"></div>
        </div>
        <div className="flex-1 p-4">
          <div className="w-full h-full bg-bg-elevated rounded-[8px]" />
        </div>
      </div>
    );
  }
  
  return <PerformanceChart data={performanceData} />;
};

export default ChartSection;
