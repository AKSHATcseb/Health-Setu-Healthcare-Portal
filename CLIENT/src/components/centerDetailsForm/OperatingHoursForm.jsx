import React from "react";
import { Clock } from "lucide-react";

export default function OperatingHoursForm({ formData, setFormData }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDayChange = (day, field, value) => {
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [day]: {
          ...(formData.operatingHours[day] || { open: "09:00", close: "18:00", closed: false }),
          [field]: value,
        },
      },
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

      {/* 24/7 Service Toggle */}
      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is24x7}
            onChange={(e) => setFormData({ ...formData, is24x7: e.target.checked })}
            className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer accent-blue-600"
          />
          <span className="font-semibold text-gray-900">
            24/7 Service Available
          </span>
        </label>
        {formData.is24x7 && (
          <p className="text-xs text-blue-700 mt-2">
            Your hospital operates round the clock. Manual timings below will be ignored.
          </p>
        )}
      </div>

      {!formData.is24x7 && (
        <div className="space-y-3">
          {days.map((day) => (
            <div key={day} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Day Name */}
                <div className="w-24">
                  <p className="text-sm font-bold text-gray-900">{day}</p>
                </div>

                {/* Closed Toggle */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      formData.operatingHours[day]?.closed || false
                    }
                    onChange={(e) =>
                      handleDayChange(day, "closed", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-2 border-gray-300 cursor-pointer accent-red-600"
                  />
                  <span className="text-xs font-semibold text-gray-700">Closed</span>
                </label>

                {/* Time Inputs */}
                {!formData.operatingHours[day]?.closed && (
                  <>
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={formData.operatingHours[day]?.open || "09:00"}
                        onChange={(e) =>
                          handleDayChange(day, "open", e.target.value)
                        }
                        className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                      <span className="text-gray-600 font-semibold">to</span>
                      <input
                        type="time"
                        value={formData.operatingHours[day]?.close || "18:00"}
                        onChange={(e) =>
                          handleDayChange(day, "close", e.target.value)
                        }
                        className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}