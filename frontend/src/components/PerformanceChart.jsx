import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './Card/Card';
import { MoreHorizontal } from 'lucide-react';

const PerformanceChart = ({ data }) => {
  const chartData = data || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-md font-sans text-left min-w-[120px]">
          <p className="text-[12px] text-gray-500 mb-1 font-medium">{label}</p>
          <p className="text-[14px] font-bold text-gray-900 tracking-tight">
            Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Performance Score</h3>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer">
          <MoreHorizontal className="w-5 h-5"/>
        </button>
      </div>
      
      <div className="flex-1 w-full bg-white p-6 rounded-b-2xl">
        <ResponsiveContainer width="100%" height="100%">
          {chartData.length === 0 ? (
            <div className="flex w-full h-full items-center justify-center text-sm text-gray-400 font-medium italic">
              No performance history available.
            </div>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="review_date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
                domain={[0, 10]}
                dx={-10}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '4 4' }} 
                wrapperStyle={{ outline: 'none' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ r: 3, fill: '#2563EB', strokeWidth: 2, stroke: '#FFFFFF' }}
                activeDot={{ r: 5, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2,  }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default PerformanceChart;
