import React from "react";
import { Check } from "lucide-react";

export default function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900">
          Step {currentStep} of {totalSteps}
        </h3>
        <p className="text-xs text-gray-600">
          {Math.round((currentStep / totalSteps) * 100)}%
        </p>
      </div>
      
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex-1">
            <div className={`h-2 rounded-full transition-all duration-300 ${
              index < currentStep
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : index === currentStep - 1
                ? "bg-gradient-to-r from-blue-500 to-teal-500"
                : "bg-gray-200"
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
}