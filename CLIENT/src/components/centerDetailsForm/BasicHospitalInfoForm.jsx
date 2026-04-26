import React from "react";
import { Hospital, Mail, Phone, FileText } from "lucide-react";

export default function BasicHospitalInfoForm({
  formData = {},
  setFormData,
  errors = {},
  setErrors,
}) {
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateError = (field, message) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  const handleHospitalNameChange = (e) => {
    const value = e.target.value;
    updateField("hospitalName", value);

    updateError(
      "hospitalName",
      value.length < 3 ? "Minimum 3 characters required" : ""
    );
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    updateField("email", value);

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    updateError("email", !valid ? "Invalid email" : "");
  };

  const handlePhoneChange = (e) => {
    // keep only digits, max 10
    let digits = e.target.value.replace(/\D/g, "").slice(0, 10);

    updateField("phone", digits);

    updateError("phone", digits.length !== 10 ? "Phone must be 10 digits" : "");
  };

  const handleRegistrationChange = (e) => {
  // allow only digits, max 10
  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);

  updateField("registrationNumber", digits);

  updateError(
    "registrationNumber",
    digits.length !== 10 ? "Must be exactly 10 digits" : ""
  );
};

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Hospital size={20} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Basic Hospital Info</h2>
      </div>

      <div className="space-y-4">
        {/* Hospital Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hospital Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Hospital
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              id="hospitalName"
              placeholder="Enter hospital name"
              value={formData?.hospitalName || ""}
              onChange={handleHospitalNameChange}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors?.hospitalName
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors?.hospitalName && (
            <p className="text-xs text-red-600 mt-1">{errors.hospitalName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              id="email"
              placeholder="contact@example.com"
              value={formData?.email || ""}
              onChange={handleEmailChange}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors?.email
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors?.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone
          </label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              id="phone"
              inputMode="numeric"
              placeholder="1234567890"
              value={formData?.phone || ""}
              onChange={handlePhoneChange}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors?.phone
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors?.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Registration Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Registration Number
          </label>
          <div className="relative">
            <FileText
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              id="registrationNumber"
              placeholder="Enter registration number"
              value={formData?.registrationNumber || ""}
              onChange={handleRegistrationChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}