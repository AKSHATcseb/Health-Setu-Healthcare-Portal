import React from "react";
import { Calendar, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

export default function QuickStatsComponent({ stats }) {
  const statItems = [
    {
      label: "Total Appointments",
      value: stats.totalAppointments,
      icon: Calendar,
      bgGradient: "from-blue-100 to-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-900",
      trend: stats.appointmentTrend,
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      bgGradient: "from-green-100 to-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-900",
      trend: stats.completedTrend,
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: AlertCircle,
      bgGradient: "from-yellow-100 to-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-900",
      trend: stats.pendingTrend,
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: Clock,
      bgGradient: "from-cyan-100 to-cyan-50",
      borderColor: "border-cyan-200",
      iconColor: "text-cyan-600",
      textColor: "text-cyan-900",
      trend: stats.upcomingTrend,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${item.bgGradient} rounded-2xl border-2 ${item.borderColor} p-5 shadow-md hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-white/40 rounded-lg flex items-center justify-center">
                <Icon size={24} className={item.iconColor} />
              </div>
              {item.trend && (
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  item.trend > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  <TrendingUp size={12} />
                  {Math.abs(item.trend)}%
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600 font-semibold mb-1">
              {item.label}
            </p>
            <p className={`text-3xl font-bold ${item.textColor}`}>
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}