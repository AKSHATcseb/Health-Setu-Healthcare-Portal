import React, { useState } from "react";
import { Heart, Calendar, Users } from "lucide-react";

export default function MedicalDetailsForm({ formData, setFormData, errors, setErrors }) {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = ["Male", "Female", "Other"];

  const validateAge = (age) => {
    const ageNum = parseInt(age);
    return age && ageNum >= 18 && ageNum <= 120;
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, age: value });
    if (value && !validateAge(value)) {
      setErrors({ ...errors, age: "Age must be between 18 and 120" });
    } else {
      setErrors({ ...errors, age: "" });
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Heart size={20} className="text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Medical Details</h2>
      </div>

      <div className="space-y-4">
        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleAgeChange}
              min="18"
              max="120"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors.age
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.age && (
            <p className="text-xs text-red-600 mt-1">{errors.age}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {genders.map((gender) => (
              <button
                key={gender}
                onClick={() => setFormData({ ...formData, gender })}
                className={`py-2.5 px-4 rounded-lg font-semibold text-sm border-2 transition-all duration-300 transform hover:scale-105 ${
                  formData.gender === gender
                    ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white border-blue-600 shadow-md"
                    : "bg-gray-100 text-gray-800 border-gray-400 hover:bg-gray-200 hover:border-blue-400"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Blood Group <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {bloodGroups.map((group) => (
              <button
                key={group}
                onClick={() => setFormData({ ...formData, bloodGroup: group })}
                className={`py-2.5 px-3 rounded-lg font-bold text-sm border-2 transition-all duration-300 transform hover:scale-105 ${
                  formData.bloodGroup === group
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-600 shadow-md"
                    : "bg-gray-100 text-gray-800 border-gray-400 hover:bg-gray-200 hover:border-red-400"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}