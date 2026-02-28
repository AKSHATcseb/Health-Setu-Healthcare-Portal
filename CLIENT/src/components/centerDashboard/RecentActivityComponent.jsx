import React from "react";
import { CheckCircle, AlertCircle, Plus, X } from "lucide-react";

export default function RecentActivityComponent({ activities }) {
  const getActivityIcon = (type) => {
    const iconMap = {
      approval: CheckCircle,
      cancellation: X,
      booking: Plus,
      rejection: AlertCircle,
    };
    return iconMap[type] || AlertCircle;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      approval: "text-green-600",
      cancellation: "text-red-600",
      booking: "text-blue-600",
      rejection: "text-orange-600",
    };
    return colorMap[type] || "text-gray-600";
  };

  const getActivityBg = (type) => {
    const bgMap = {
      approval: "bg-green-100",
      cancellation: "bg-red-100",
      booking: "bg-blue-100",
      rejection: "bg-orange-100",
    };
    return bgMap[type] || "bg-gray-100";
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => {
            const ActivityIcon = getActivityIcon(activity.type);
            return (
              <div
                key={index}
                className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-b-0"
              >
                <div className={`${getActivityBg(activity.type)} p-2 rounded-lg`}>
                  <ActivityIcon
                    size={16}
                    className={getActivityColor(activity.type)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-gray-200">
            <p className="text-sm text-gray-600">No recent activities</p>
          </div>
        )}
      </div>
    </div>
  );
}