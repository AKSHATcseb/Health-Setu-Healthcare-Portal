import React from "react";
import { Droplet } from "lucide-react";

export default function DialysisDetailsForm({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  // ---------------- VALIDATORS ----------------
  const validateSeats = (seats) => {
    const num = parseInt(seats, 10);
    return seats !== "" && !isNaN(num) && num > 0 && num <= 500;
  };

  const validatePrice = (price) => {
    const num = Number(price);
    return price !== "" && !isNaN(num) && num >= 0;
  };

  // ---------------- TYPES (UI + BACKEND SAFE) ----------------
  const dialysisTypes = [
    { label: "Hemodialysis", value: "hemodialysis" },
    { label: "Peritoneal Dialysis", value: "peritoneal dialysis" },
    { label: "Both", value: "both" },
  ];

  const isHemodialysis = formData.dialysisType === "hemodialysis";
  const isPeritoneal = formData.dialysisType === "peritoneal dialysis";
  const isBoth = formData.dialysisType === "both";

  // ---------------- HANDLERS ----------------

  const handleTypeSelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      dialysisType: value,
    }));

    setErrors((prev) => ({
      ...prev,
      dialysisType: "",
      priceFor4Hrs:
        (value === "hemodialysis" || value === "both") &&
        !validatePrice(formData.priceFor4Hrs)
          ? "Price for 4 hours is required"
          : "",
      priceFor6Hrs:
        (value === "hemodialysis" || value === "both") &&
        !validatePrice(formData.priceFor6Hrs)
          ? "Price for 6 hours is required"
          : "",
      priceForPD:
        (value === "peritoneal dialysis" || value === "both") &&
        !validatePrice(formData.priceForPD)
          ? "Price for PD is required"
          : "",
    }));
  };

  const handleSeatsChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      dialysisSeats: value,
    }));

    if (!validateSeats(value)) {
      setErrors((prev) => ({
        ...prev,
        dialysisSeats: "Number of seats must be between 1 and 500",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        dialysisSeats: "",
      }));
    }

    const type = formData.dialysisType;

    // Hemodialysis validation
    if (type === "hemodialysis" || type === "both") {
      setErrors((prev) => ({
        ...prev,
        priceFor4Hrs: validatePrice(formData.priceFor4Hrs)
          ? ""
          : "Price for 4 hours is required",
        priceFor6Hrs: validatePrice(formData.priceFor6Hrs)
          ? ""
          : "Price for 6 hours is required",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        priceFor4Hrs: "",
        priceFor6Hrs: "",
      }));
    }

    // Peritoneal validation
    if (type === "peritoneal dialysis" || type === "both") {
      setErrors((prev) => ({
        ...prev,
        priceForPD: validatePrice(formData.priceForPD)
          ? ""
          : "Price for PD is required",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        priceForPD: "",
      }));
    }
  };

  const handlePriceChange = (field) => (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: validatePrice(value) ? "" : "Please enter a valid price",
    }));
  };

  // ---------------- UI ----------------

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Droplet size={20} className="text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">
          Dialysis Facilities
        </h2>
      </div>

      <div className="space-y-4">
        {/* Seats */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Dialysis Seats <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="Enter number of dialysis seats"
            value={formData.dialysisSeats}
            onChange={handleSeatsChange}
            min="1"
            max="500"
            className={`w-full px-4 py-2.5 rounded-lg border-2 ${
              errors.dialysisSeats
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
          />
          {errors.dialysisSeats && (
            <p className="text-xs text-red-600 mt-1">
              {errors.dialysisSeats}
            </p>
          )}
        </div>

        {/* Dialysis Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Types of Dialysis Offered <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {dialysisTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleTypeSelect(type.value)}
                className={`py-3 px-4 rounded-lg font-semibold text-sm border-2 ${
                  formData.dialysisType === type.value
                    ? "bg-slate-800 text-white"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {errors.dialysisType && (
            <p className="text-xs text-red-600 mt-2">
              {errors.dialysisType}
            </p>
          )}
        </div>

        {/* Prices */}
        {(isHemodialysis || isBoth) && (
          <>
            <input
            className="border-2 p-2 border-slate-200 rounded-lg"
              type="number"
              placeholder="Price for 4 hrs"
              value={formData.priceFor4Hrs}
              onChange={handlePriceChange("priceFor4Hrs")}
            />
            {errors.priceFor4Hrs && (
              <p className="text-xs text-red-600">
                {errors.priceFor4Hrs}
              </p>
            )}

            <input
              className="border-2 p-2 border-slate-200 rounded-lg"
              type="number"
              placeholder="Price for 6 hrs"
              value={formData.priceFor6Hrs}
              onChange={handlePriceChange("priceFor6Hrs")}
            />
            {errors.priceFor6Hrs && (
              <p className="text-xs text-red-600">
                {errors.priceFor6Hrs}
              </p>
            )}
          </>
        )}

        {(isPeritoneal || isBoth) && (
          <>
            <input
              className="border-2 p-2 border-slate-200 rounded-lg"
              type="number"
              placeholder="Monthly PD price"
              value={formData.priceForPD}
              onChange={handlePriceChange("priceForPD")}
            />
            {errors.priceForPD && (
              <p className="text-xs text-red-600">
                {errors.priceForPD}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}