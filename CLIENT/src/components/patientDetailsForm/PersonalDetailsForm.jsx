import React from "react";

export default function PersonalDetailsForm({
  formData,
  setFormData,
  errors,
  setErrors,
  disableNameEmail = false,
  readOnlyEmail = false,
}) {
  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData((p) => ({ ...p, fullName: value }));
    if (!value || value.trim().length < 2) {
      setErrors((prev) => ({ ...prev, fullName: "Please enter your full name" }));
    } else {
      setErrors((prev) => ({ ...prev, fullName: "" }));
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 15);
    setFormData((p) => ({ ...p, mobileNumber: value }));
    if (!/^\d{10,15}$/.test(value)) {
      setErrors((prev) => ({ ...prev, mobileNumber: "Enter a valid mobile number" }));
    } else {
      setErrors((prev) => ({ ...prev, mobileNumber: "" }));
    }
  };

  const handleEmailChange = (e) => {
    // If readOnlyEmail is true we ignore client changes
    if (readOnlyEmail) return;
    const value = e.target.value;
    setFormData((p) => ({ ...p, email: value }));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Full name */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
        <input
          type="text"
          value={formData.fullName || ""}
          onChange={handleNameChange}
          disabled={disableNameEmail}
          placeholder="John Doe"
          className={`w-full px-4 py-3 rounded-lg border ${disableNameEmail ? "bg-gray-100" : "bg-white"} `}
        />
        {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
        <input
          type="email"
          value={formData.email || ""}
          onChange={handleEmailChange}
          placeholder="you@example.com"
          readOnly={readOnlyEmail}
          disabled={disableNameEmail}
          className={`w-full px-4 py-3 rounded-lg border ${readOnlyEmail || disableNameEmail ? "bg-gray-100" : "bg-white"}`}
        />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
      </div>

      {/* Mobile */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Mobile Number</label>
        <input
          type="tel"
          value={formData.mobileNumber || ""}
          onChange={handleMobileChange}
          placeholder="9999999999"
          className="w-full px-4 py-3 rounded-lg border bg-white"
        />
        {errors.mobileNumber && <p className="text-xs text-red-600 mt-1">{errors.mobileNumber}</p>}
      </div>
    </div>
  );
}