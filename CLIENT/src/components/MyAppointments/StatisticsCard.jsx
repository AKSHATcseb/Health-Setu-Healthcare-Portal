import React from "react";

export default function StatisticsCard({ stats }) {
  const statItems = [
    {
      label: "Total",
      value: stats.total,
      icon: "📅",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: "✅",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: "🕐",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: "❌",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`rounded-xl bg-slate-50 py-3 px-5 shadow-sm `}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 font-semibold mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            <span className="text-xl shrink-0">{item.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}