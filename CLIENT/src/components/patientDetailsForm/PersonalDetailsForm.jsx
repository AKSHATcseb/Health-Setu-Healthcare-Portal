import React, { useState } from "react";
import { User, Phone, Mail } from "lucide-react";

export default function PersonalDetailsForm({ formData, setFormData, errors, setErrors }) {
  const validateName = (name) => {
    return /^[a-zA-Z\s]{3,}$/.test(name);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone.replace(/\D/g, ""));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, fullName: value });
    if (value && !validateName(value)) {
      setErrors({ ...errors, fullName: "Name must be at least 3 characters" });
    } else {
      setErrors({ ...errors, fullName: "" });
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);
    
    // Format phone number
    if (value.length > 0) {
      if (value.length <= 3) {
        value = value;
      } else if (value.length <= 6) {
        value = `${value.slice(0, 3)} ${value.slice(3)}`;
      } else {
        value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
      }
    }

    setFormData({ ...formData, mobileNumber: value });
    if (value && !validatePhone(value)) {
      setErrors({ ...errors, mobileNumber: "Phone must be 10 digits" });
    } else {
      setErrors({ ...errors, mobileNumber: "" });
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    if (value && !validateEmail(value)) {
      setErrors({ ...errors, email: "Invalid email address" });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <User size={20} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Personal Details</h2>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleNameChange}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors.fullName
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={formData.mobileNumber}
              onChange={handlePhoneChange}
              maxLength="12"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors.mobileNumber
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.mobileNumber && (
            <p className="text-xs text-red-600 mt-1">{errors.mobileNumber}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleEmailChange}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors.email
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}