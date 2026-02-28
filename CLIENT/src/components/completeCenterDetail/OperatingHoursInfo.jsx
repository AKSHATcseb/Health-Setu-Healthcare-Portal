import React from "react";
import { Clock, CheckCircle } from "lucide-react";

export default function OperatingHoursInfo({ operatingHours, is24x7 }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const formatTime = (time) => {
    if (!time) return "Closed";
    return new Date(`2024-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Clock size={20} className="text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Operating Hours</h2>
      </div>

      {is24x7 ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200 text-center">
          <CheckCircle size={32} className="text-green-600 mx-auto mb-3" />
          <p className="text-xl font-bold text-green-900 mb-2">
            24/7 Service Available
          </p>
          <p className="text-sm text-green-800">
            The hospital operates round the clock, 24 hours a day, 7 days a week
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {days.map((day) => {
            const dayData = operatingHours[day];
            const isClosed = dayData?.closed;

            return (
              <div
                key={day}
                className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                  isClosed
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900 w-24">
                  {day}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    isClosed
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {isClosed ? (
                    "Closed"
                  ) : (
                    <>
                      {formatTime(dayData?.open)} - {formatTime(dayData?.close)}
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}