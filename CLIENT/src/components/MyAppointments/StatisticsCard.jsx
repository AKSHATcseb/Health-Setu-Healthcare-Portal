import React from "react";

export default function StatisticsCard({ stats }) {
  const statItems = [
    {
      label: "Total",
      value: stats.total,
      icon: "📅",
      bgGradient: "from-blue-100 to-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: "✅",
      bgGradient: "from-green-100 to-green-50",
      borderColor: "border-green-200",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: "🕐",
      bgGradient: "from-cyan-100 to-cyan-50",
      borderColor: "border-cyan-200",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: "❌",
      bgGradient: "from-red-100 to-red-50",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${item.bgGradient} rounded-xl border-2 ${item.borderColor} p-3 shadow-sm hover:shadow-md transition-all duration-300`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 font-semibold mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            <span className="text-xl flex-shrink-0">{item.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}