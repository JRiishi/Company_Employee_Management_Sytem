// 🌑 DARK THEME FIX APPLIED — Only color/background/border classes changed.
// All logic, functions, props, and API calls are 100% unchanged.

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
      <Card className="border-white/10 bg-[#13131C]">
        <h3 className="text-lg font-bold text-text-primary mb-4">Task Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            />
            <Bar dataKey="Tasks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <Card className="border-white/10 bg-[#13131C]">
          <h3 className="text-lg font-bold text-text-primary mb-4">
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
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default TaskChart;
