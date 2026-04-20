// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Performance score line chart visualization

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './Card/Card';
import { MoreHorizontal } from 'lucide-react';

const PerformanceChart = ({ data }) => {
  const chartData = data || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-elevated border border-border-default p-3 rounded-[8px] shadow-floating font-sans text-left min-w-[140px]">
          <p className="text-xs text-text-muted mb-1 font-medium">{label}</p>
          <p className="text-sm font-semibold text-text-primary tracking-tight">
            Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col h-[240px] w-full overflow-hidden">
      <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center flex-shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-text-primary tracking-tight">Performance Score</h3>
        </div>
        <button className="text-text-muted hover:text-text-secondary transition-colors duration-150 cursor-pointer p-1">
          <MoreHorizontal className="w-4 h-4"/>
        </button>
      </div>
      
      <div className="flex-1 w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartData.length === 0 ? (
            <div className="flex w-full h-full items-center justify-center text-xs text-text-muted font-medium">
              No performance history available.
            </div>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 0, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis 
                dataKey="review_date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#55556A', fontSize: 11, fontWeight: 500 }} 
                dy={8}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#55556A', fontSize: 11, fontWeight: 500 }}
                domain={[0, 10]}
                dx={-10}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: 'rgba(99, 102, 241, 0.2)', strokeWidth: 2 }} 
                wrapperStyle={{ outline: 'none' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#6366F1" 
                strokeWidth={2}
                dot={{ r: 3, fill: '#6366F1', strokeWidth: 0 }}
                activeDot={{ r: 4, fill: '#6366F1' }}
                animationDuration={600}
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
