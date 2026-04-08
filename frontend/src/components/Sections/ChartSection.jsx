import React from 'react';
import PerformanceChart from '../PerformanceChart';
import Card from '../Card/Card';

const ChartSection = ({ performanceData, loading }) => {
  if (loading) {
    return (
      <Card hoverable className="h-[420px] flex flex-col w-full relative">
        <div className="flex flex-col h-full overflow-hidden animate-pulse">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
            <div className="h-[18px] bg-gray-200 rounded w-32"></div>
            <div className="h-5 bg-gray-100 rounded w-5"></div>
          </div>
          <div className="flex-1 p-6 w-full">
            <div className="w-full h-full bg-gray-50/50 rounded-xl border border-gray-100/50 relative overflow-hidden flex flex-col justify-between py-6">
              <div className="w-full h-px bg-gray-100"></div>
              <div className="w-full h-px bg-gray-100"></div>
              <div className="w-full h-px bg-gray-100"></div>
              <div className="w-full h-px bg-gray-100"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  return <PerformanceChart data={performanceData} />;
};
export default ChartSection;
