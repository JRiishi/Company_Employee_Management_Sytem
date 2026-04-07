import React from 'react';
import Card from '../Card/Card';

const StatsCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <Card hoverable className="p-5 group">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[13px] font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </h3>
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center transition-colors duration-200">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-gray-900 leading-none">
          {value}
        </span>
        {trend && (
          <span className={`text-[13px] font-medium ${trend.startsWith('+') ? 'text-emerald-600' : trend.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
};
export default StatsCard;
