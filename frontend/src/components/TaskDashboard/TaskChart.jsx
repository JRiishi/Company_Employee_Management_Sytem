// � UNIVERSE UI APPLIED — Logic unchanged. Visual layer only.
// Changes: Fixed background colors to glassmorphism, updated text sizing and dark theme grid/tooltip logic.

import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "../Card/Card";

const TaskChart = ({ stats }) => {
  // Data for bar chart
  const barData = [
    {
      name: "Total Tasks",
      Tasks: stats.total,
    },
    {
      name: "Completed",
      Tasks: stats.completed,
    },
    {
      name: "Ongoing",
      Tasks: stats.ongoing,
    },
    {
      name: "Pending",
      Tasks: stats.pending,
    },
  ];

  // Data for pie chart
  const pieData = [
    { name: "Completed", value: stats.completed, fill: "#10b981" },
    { name: "Ongoing", value: stats.ongoing, fill: "#3b82f6" },
    { name: "Pending", value: stats.pending, fill: "#f59e0b" },
  ].filter((item) => item.value > 0);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Bar Chart */}
      <Card style={{ background: 'rgba(19, 19, 28, 0.70)', backdropFilter: 'blur(16px)' }}>
        <h3 className="text-xl font-bold text-gray-100 mb-4">Task Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#9090AA', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9090AA', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'rgba(26,26,38,0.95)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '10px',
                backdropFilter: 'blur(12px)',
                color: '#F0F0FA',
                fontSize: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
              labelStyle={{ color: '#9090AA', marginBottom: '4px', fontSize: '11px' }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Bar dataKey="Tasks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <Card style={{ background: 'rgba(19, 19, 28, 0.70)', backdropFilter: 'blur(16px)' }}>
          <h3 className="text-xl font-bold text-gray-100 mb-4">
            Task Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                stroke="transparent"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(26,26,38,0.95)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: '10px',
                  backdropFilter: 'blur(12px)',
                  color: '#F0F0FA',
                  fontSize: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
                labelStyle={{ color: '#9090AA', marginBottom: '4px', fontSize: '11px' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default TaskChart;
