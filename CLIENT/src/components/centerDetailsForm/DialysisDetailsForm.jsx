import React from "react";
import { Droplet, AlertCircle, CheckCircle } from "lucide-react";

export default function DialysisDetailsForm({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const validateSeats = (seats) => {
    const num = parseInt(seats);
    return seats && num > 0 && num <= 500;
  };

  const handleSeatsChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, dialysisSeats: value });
    if (value && !validateSeats(value)) {
      setErrors({
        ...errors,
        dialysisSeats: "Number of seats must be between 1 and 500",
      });
    } else {
      setErrors({ ...errors, dialysisSeats: "" });
    }
  };

  const dialysisTypes = ["Hemodialysis", "Peritoneal Dialysis", "Both"];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Droplet size={20} className="text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Dialysis Facilities</h2>
      </div>

      <div className="space-y-4">
        {/* Number of Dialysis Seats */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Dialysis Seats <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Droplet
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              placeholder="Enter number of dialysis seats"
              value={formData.dialysisSeats}
              onChange={handleSeatsChange}
              min="1"
              max="500"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors.dialysisSeats
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.dialysisSeats && (
            <p className="text-xs text-red-600 mt-1">{errors.dialysisSeats}</p>
          )}
        </div>

        {/* Dialysis Types */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Types of Dialysis Offered <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {dialysisTypes.map((type) => (
              <button
                key={type}
                onClick={() =>
                  setFormData({
                    ...formData,
                    dialysisType: type,
                  })
                }
                className={`py-3 px-4 rounded-lg font-semibold text-sm border-2 transition-all duration-300 transform hover:scale-105 ${
                  formData.dialysisType === type
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-600 shadow-md"
                    : "bg-gray-100 text-gray-800 border-gray-400 hover:bg-gray-200 hover:border-red-400"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Services */}
        <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.emergencyServices}
              onChange={(e) =>
                setFormData({ ...formData, emergencyServices: e.target.checked })
              }
              className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer accent-red-600"
            />
            <span className="font-semibold text-gray-900">
              Emergency Services Available
            </span>
          </label>
        </div>

        {/* Home Collection */}
        {/* <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.homeCollection}
              onChange={(e) =>
                setFormData({ ...formData, homeCollection: e.target.checked })
              }
              className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer accent-blue-600"
            />
            <span className="font-semibold text-gray-900">
              Home Collection Service Available
            </span>
          </label>
        </div> */}

        {/* Lab Tests Available */}
        {/* <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.labTests}
              onChange={(e) =>
                setFormData({ ...formData, labTests: e.target.checked })
              }
              className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer accent-green-600"
            />
            <span className="font-semibold text-gray-900">
              Lab Tests Available
            </span>
          </label>
        </div> */}
      </div>
    </div>
  );
}