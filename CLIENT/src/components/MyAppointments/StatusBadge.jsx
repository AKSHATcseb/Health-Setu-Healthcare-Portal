import React from "react";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function StatusBadge({ status }) {
  const statusConfig = {
    pending: {
      icon: AlertCircle,
      label: "Pending",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-300",
      dotColor: "bg-yellow-500",
    },
    upcoming: {
      icon: Clock,
      label: "Upcoming",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-300",
      dotColor: "bg-blue-500",
    },
    completed: {
      icon: CheckCircle,
      label: "Completed",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-300",
      dotColor: "bg-green-500",
    },
    cancelled: {
      icon: XCircle,
      label: "Cancelled",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      borderColor: "border-red-300",
      dotColor: "bg-red-500",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs border-2 ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`}></span>
      <Icon size={12} />
      <span>{config.label}</span>
    </div>
  );
}