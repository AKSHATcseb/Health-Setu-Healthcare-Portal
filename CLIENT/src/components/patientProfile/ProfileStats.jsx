import React from "react";
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function ProfileStats({ stats }) {
  const statItems = [
    {
      label: "Total Appointments",
      value: stats.totalAppointments,
      icon: Calendar,
      bgGradient: "from-blue-100 to-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      bgGradient: "from-green-100 to-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: Clock,
      bgGradient: "from-cyan-100 to-cyan-50",
      borderColor: "border-cyan-200",
      iconColor: "text-cyan-600",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: AlertCircle,
      bgGradient: "from-orange-100 to-orange-50",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${item.bgGradient} rounded-xl border-2 ${item.borderColor} p-4 shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-semibold mb-2">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
              <Icon size={20} className={`${item.iconColor} flex-shrink-0`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}