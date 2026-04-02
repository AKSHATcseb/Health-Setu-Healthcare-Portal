import React from "react";
import { ChevronLeft, CheckCircle, Loader } from "lucide-react";

export default function HospitalFormActions({
  onBack,
  onSubmit,
  isLoading,
  isFormValid,
  currentStep,
  totalSteps,
}) {
  return (
    <div className="flex gap-3 pt-6">
      {currentStep > 1 && (
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      )}

      

      <button
        onClick={onSubmit}
        disabled={isLoading || !isFormValid}
        className={`w-full inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg font-semibold text-white transition-transform transform ${
          isFormValid && !isLoading
            ? "bg-linear-to-r from-blue-600 to-teal-600 text-white hover:shadow-lg hover:scale-105"
            : "bg-gray-400 text-white cursor-not-allowed"
        }`}
          style={{
            background: "linear-gradient(90deg,#0ea5e9 0%, #0369a1 100%)",
            boxShadow: "0 8px 30px rgba(2,6,23,0.35)",
          }}
      >
        {isLoading ? (
          <>
            <Loader size={16} className="animate-spin" />
            {currentStep === totalSteps ? "Updating Profile..." : "Continuing..."}
          </>
        ) : (
          <>
            <CheckCircle size={16} />
            {currentStep === totalSteps ? "Profile Updated" : "Next"}
          </>
        )}
      </button>
    </div>
  );
}