// 🌌 UNIVERSE UI APPLIED — Logic unchanged. Visual layer only.
// Changes: Replaced Recharts tooltip and grid with dark theme glass equivalents.

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './Card/Card';
import { MoreHorizontal } from 'lucide-react';

const PerformanceChart = ({ data }) => {
  const chartData = data || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(26,26,38,0.95)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '10px',
          backdropFilter: 'blur(12px)',
          color: '#F0F0FA',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          padding: '12px',
          minWidth: '140px'
        }}>
          <p style={{ color: '#9090AA', marginBottom: '4px', fontSize: '11px', fontWeight: 500 }}>{label}</p>
          <p style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.02em' }}>
            Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col w-full h-[240px] overflow-hidden" style={{ background: 'rgba(19, 19, 28, 0.70)', backdropFilter: 'blur(16px)' }}>
      <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center flex-shrink-0">
        <div>
          <h3 className="text-base font-semibold text-gray-100 tracking-tight">Performance Score</h3>
        </div>
        <button className="text-gray-500 hover:text-gray-300 transition-colors duration-150 cursor-pointer p-1">
          <MoreHorizontal className="w-4 h-4"/>
        </button>
      </div>
      
      <div className="flex-1 w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartData.length === 0 ? (
            <div className="flex w-full h-full items-center justify-center text-xs text-gray-500 font-medium">
              No performance history available.
            </div>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 0, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="review_date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9090AA', fontSize: 11 }}
                dy={8}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9090AA', fontSize: 11 }}
                domain={[0, 10]}
                dx={-10}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: 'rgba(255,255,255,0.03)', strokeWidth: 1 }} 
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
