import React, { useState } from "react";
import { CreditCard, Building } from "lucide-react";

export default function BankDetailsForm({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  
const validateUpiID = (upiID) =>
  /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(upiID);

  const handleUpiIDChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, upiID: value });
    if (value && !validateUpiID(value)) {
      setErrors({
        ...errors,
        upiID: "Invalid UPI ID format",
      });
    } else {
      setErrors({ ...errors, upiID: "" });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Building size={20} className="text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Bank Details</h2>
      </div>

      <p className="text-xs text-gray-600 mb-4">
        For receiving payments from patients
      </p>

      <div className="space-y-4">
        {/* Account Holder Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Account Holder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter account holder name"
            value={formData.accountHolderName}
            onChange={(e) =>
              setFormData({ ...formData, accountHolderName: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
          />
        </div>

        {/* UPI ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            UPI ID <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <CreditCard
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={formData.upiID}
              onChange={handleUpiIDChange}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors.upiID
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.upiID && (
            <p className="text-xs text-red-600 mt-1">{errors.upiID}</p>
          )}
        </div>
      </div>
    </div>
  );
}