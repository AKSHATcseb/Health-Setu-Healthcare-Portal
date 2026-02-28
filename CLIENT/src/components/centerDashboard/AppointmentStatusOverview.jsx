import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AppointmentStatusOverview({ data }) {
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const chartData = [
    { name: "Upcoming", value: data.upcoming },
    { name: "Completed", value: data.completed },
    { name: "Pending", value: data.pending },
    { name: "Cancelled", value: data.cancelled },
    { name: "No-Show", value: data.noShow },
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Appointment Status Overview</h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) =>
                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            ></div>
            <span className="text-xs font-semibold text-gray-700">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}