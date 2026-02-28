import React, { useState } from "react";
import { Building2, Phone, Mail, Globe } from "lucide-react";

export default function BasicHospitalInfoForm({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const validateHospitalName = (name) => {
    return name && name.trim().length >= 3;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone.replace(/\D/g, ""));
  };

  const validateWebsite = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleHospitalNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, hospitalName: value });
    if (value && !validateHospitalName(value)) {
      setErrors({ ...errors, hospitalName: "Hospital name must be at least 3 characters" });
    } else {
      setErrors({ ...errors, hospitalName: "" });
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

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);

    if (value.length > 0) {
      if (value.length <= 3) {
        value = value;
      } else if (value.length <= 6) {
        value = `${value.slice(0, 3)} ${value.slice(3)}`;
      } else {
        value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
      }
    }

    setFormData({ ...formData, phone: value });
    if (value && !validatePhone(value)) {
      setErrors({ ...errors, phone: "Phone must be 10 digits" });
    } else {
      setErrors({ ...errors, phone: "" });
    }
  };

  const handleWebsiteChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, website: value });
    if (value && !validateWebsite(value)) {
      setErrors({ ...errors, website: "Invalid website URL" });
    } else {
      setErrors({ ...errors, website: "" });
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Building2 size={20} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Basic Hospital Information</h2>
      </div>

      <div className="space-y-4">
        {/* Hospital Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hospital Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Enter hospital name"
              value={formData.hospitalName}
              onChange={handleHospitalNameChange}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors.hospitalName
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.hospitalName && (
            <p className="text-xs text-red-600 mt-1">{errors.hospitalName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Enter hospital email"
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

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength="12"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors.phone
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Website */}
        {/* <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Website (Optional)
          </label>
          <div className="relative">
            <Globe
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.website}
              onChange={handleWebsiteChange}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors.website
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div> */}
          {/* {errors.website && (
            <p className="text-xs text-red-600 mt-1">{errors.website}</p>
          )}
        </div> */}
      </div>
    </div>
  );
}