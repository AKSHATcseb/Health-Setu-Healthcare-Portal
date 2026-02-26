import React from "react";
import { DollarSign, Percent } from "lucide-react";

export default function PaymentBreakdown({ pricing }) {
  const subtotal = pricing.baseFee + pricing.serviceFee;
  const discount = (subtotal * pricing.discountPercent) / 100;
  const total = subtotal - discount + pricing.taxes;

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-300 p-7 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <DollarSign size={22} className="text-green-600" />
        Cost Breakdown
      </h3>

      <div className="space-y-3">
        {/* Base Consultation Fee */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <span className="text-gray-700 font-medium">Consultation Fee</span>
          <span className="text-gray-900 font-bold">${pricing.baseFee.toFixed(2)}</span>
        </div>

        {/* Service Fee */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <span className="text-gray-700 font-medium">Service Fee</span>
          <span className="text-gray-900 font-bold">${pricing.serviceFee.toFixed(2)}</span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
          <span className="text-gray-700 font-semibold">Subtotal</span>
          <span className="text-blue-600 font-bold text-lg">${subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200">
            <span className="text-green-700 font-medium flex items-center gap-2">
              <Percent size={16} /> Discount ({pricing.discountPercent}%)
            </span>
            <span className="text-green-600 font-bold">-${discount.toFixed(2)}</span>
          </div>
        )}

        {/* Taxes */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <span className="text-gray-700 font-medium">Taxes</span>
          <span className="text-gray-900 font-bold">${pricing.taxes.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white mt-4">
          <span className="font-bold text-lg">Total Amount</span>
          <span className="text-3xl font-bold">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}