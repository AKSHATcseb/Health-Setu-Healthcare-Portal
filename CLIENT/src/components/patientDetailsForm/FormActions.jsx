import React from "react";

/**
 * FormActions (redesigned)
 *
 * - Matches the site's dark/charcoal palette used across auth/profile pages.
 * - Responsive: stacked on small screens, inline on larger screens.
 * - Preserves all props and behavior (no logic/backend changes).
 *
 * Props:
 * - onBack: () => void
 * - onSubmit: () => void
 * - isLoading: boolean
 * - isFormValid: boolean
 * - currentStep: number
 * - totalSteps: number
 */
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
    <div className="w-full flex flex-col sm:flex-row items-center gap-3 mt-4">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        disabled={currentStep === 1 || isLoading}
        className="w-full sm:w-auto px-4 py-2 rounded-lg transition-colors text-sm font-medium
                   bg-white/6 text-slate-100 border border-white/8 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Back"
      >
        Back
      </button>

      {/* Primary action - full width on mobile, auto width on larger screens */}
      <div className="w-full sm:w-auto sm:ml-auto">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isFormValid || isLoading}
          aria-label={isLast ? "Complete profile" : "Save and continue"}
          className={`w-full inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg font-semibold text-white transition-transform transform
            ${!isFormValid || isLoading ? "opacity-60 pointer-events-none" : "hover:-translate-y-0.5"}`}
          style={{
            background: "linear-gradient(90deg,#0ea5e9 0%, #0369a1 100%)",
            boxShadow: "0 8px 30px rgba(2,6,23,0.35)",
          }}
        >
          {isLoading ? (
            <>
              <span
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
              <span className="text-sm">{isLast ? "Completing..." : "Saving..."}</span>
            </>
          ) : (
            <span className="text-sm">{isLast ? "Complete Profile" : "Save & Continue"}</span>
          )}
        </button>
      </div>
    </div>
  );
}