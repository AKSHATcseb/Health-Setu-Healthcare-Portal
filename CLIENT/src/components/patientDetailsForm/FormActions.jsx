import React from "react";

export default function FormActions({
  onBack,
  onSubmit,
  isLoading,
  isFormValid,
  currentStep,
  totalSteps,
}) {
  const isLast = currentStep === totalSteps;
  return (
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={onBack}
        disabled={currentStep === 1 || isLoading}
        className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50"
      >
        Back
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!isFormValid || isLoading}
        className="ml-auto px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold disabled:opacity-50 flex items-center gap-2"
      >
        {isLoading ? (
          <span className="inline-flex items-center">
            <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {isLast ? "Completing..." : "Saving..."}
          </span>
        ) : (
          <span>{isLast ? "Complete Profile" : "Save & Continue"}</span>
        )}
      </button>
    </div>
  );
}