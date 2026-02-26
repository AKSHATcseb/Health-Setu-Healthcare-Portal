import React from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function ConfirmationButtons({
  onConfirm,
  onCancel,
  isLoading = false,
  agreeToTerms = false,
  setAgreeToTerms,
}) {
  return (
    <div className="bg-white rounded-3xl border-2 border-gray-300 p-7 mb-8 shadow-xl">
      {/* Terms and Conditions */}
      <div className="mb-8 p-5 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
        <div className="flex gap-3">
          <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 mb-2">Important Notice</p>
            <p className="text-sm text-gray-700 mb-4">
              By confirming this appointment, you agree to our terms of service and
              understand that cancellation is only allowed 24 hours before the appointment.
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                I agree to the terms and conditions
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cancel Button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          disabled={isLoading || !agreeToTerms}
          className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white border-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            agreeToTerms
              ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-600 hover:shadow-lg"
              : "bg-gray-400 border-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              Confirm & Pay
            </>
          )}
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-gray-700">
        <p>
          <span className="font-semibold">💡 Tip:</span> You'll receive a confirmation email
          and SMS with appointment details after payment.
        </p>
      </div>
    </div>
  );
}