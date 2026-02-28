import React from "react";
import { Droplet, CheckCircle, AlertCircle } from "lucide-react";

export default function DialysisFacilitiesInfo({ dialysisInfo }) {
  const dialysisTypeData = {
    "Hemodialysis": "Traditional dialysis using an artificial kidney machine",
    "Peritoneal Dialysis": "Dialysis using the peritoneal membrane in the abdomen",
    "Both": "Both hemodialysis and peritoneal dialysis available",
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Droplet size={20} className="text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Dialysis Facilities</h2>
      </div>

      <div className="space-y-5">
        {/* Available Seats */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
          <p className="text-xs text-blue-700 font-semibold mb-2">
            Available Dialysis Seats
          </p>
          <p className="text-3xl font-bold text-blue-900">
            {dialysisInfo.seats}
          </p>
          <p className="text-xs text-blue-700 mt-2">
            Total capacity for patient treatment
          </p>
        </div>

        {/* Dialysis Type */}
        <div>
          <p className="text-xs text-gray-600 font-semibold mb-3">
            Types of Dialysis Offered
          </p>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border-2 border-red-200">
            <p className="text-sm font-bold text-red-900 mb-2">
              {dialysisInfo.type}
            </p>
            <p className="text-xs text-red-800">
              {dialysisTypeData[dialysisInfo.type]}
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-3">
          <p className="text-xs text-gray-600 font-semibold">
            Additional Services
          </p>

          {dialysisInfo.emergencyServices && (
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900">
                  Emergency Services
                </p>
                <p className="text-xs text-red-800">
                  Available for emergency dialysis needs
                </p>
              </div>
            </div>
          )}

          {dialysisInfo.homeCollection && (
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-900">
                  Home Collection Service
                </p>
                <p className="text-xs text-green-800">
                  Available for lab tests
                </p>
              </div>
            </div>
          )}

          {dialysisInfo.labTests && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-900">Lab Tests</p>
                <p className="text-xs text-blue-800">
                  On-site laboratory facilities available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}