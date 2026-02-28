import React, { useState } from "react";
import { CreditCard, Building } from "lucide-react";

export default function BankDetailsForm({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const validateAccountNumber = (accountNumber) => {
    return accountNumber && accountNumber.replace(/\D/g, "").length >= 9;
  };

  const validateIFSC = (ifsc) => {
    return ifsc && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, accountNumber: value });
    if (value && !validateAccountNumber(value)) {
      setErrors({
        ...errors,
        accountNumber: "Invalid account number",
      });
    } else {
      setErrors({ ...errors, accountNumber: "" });
    }
  };

  const handleIFSCChange = (e) => {
    const value = e.target.value.toUpperCase();
    setFormData({ ...formData, ifscCode: value });
    if (value && !validateIFSC(value)) {
      setErrors({
        ...errors,
        ifscCode: "Invalid IFSC code format",
      });
    } else {
      setErrors({ ...errors, ifscCode: "" });
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
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

        {/* Bank Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter bank name"
            value={formData.bankName}
            onChange={(e) =>
              setFormData({ ...formData, bankName: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
          />
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Account Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <CreditCard
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={handleAccountNumberChange}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm ${
                errors.accountNumber
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.accountNumber && (
            <p className="text-xs text-red-600 mt-1">{errors.accountNumber}</p>
          )}
        </div>

        {/* IFSC Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            IFSC Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="E.g., SBIN0001234"
            value={formData.ifscCode}
            onChange={handleIFSCChange}
            maxLength="11"
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm uppercase ${
              errors.ifscCode
                ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }`}
          />
          {errors.ifscCode && (
            <p className="text-xs text-red-600 mt-1">{errors.ifscCode}</p>
          )}
        </div>
      </div>
    </div>
  );
}