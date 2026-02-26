import React from "react";
import { CreditCard, Wallet, Smartphone } from "lucide-react";

export default function PaymentMethod({ selectedMethod, setSelectedMethod }) {
  const paymentMethods = [
    {
      id: "card",
      label: "Credit/Debit Card",
      icon: CreditCard,
      color: "from-blue-500 to-blue-600",
      description: "Visa, Mastercard, Amex",
    },
    {
      id: "wallet",
      label: "Digital Wallet",
      icon: Wallet,
      color: "from-purple-500 to-purple-600",
      description: "Google Pay, Apple Pay",
    },
    {
      id: "upi",
      label: "UPI",
      icon: Smartphone,
      color: "from-orange-500 to-orange-600",
      description: "Fast & Secure",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-300 p-7 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CreditCard size={22} className="text-blue-600" />
        Payment Method
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <label
              key={method.id}
              className="relative cursor-pointer group"
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="sr-only"
              />
              <div
                className={`p-5 rounded-2xl transition-all duration-300 border-2 transform hover:scale-105 ${
                  selectedMethod === method.id
                    ? `bg-gradient-to-r ${method.color} text-white shadow-lg`
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-400 hover:border-blue-400"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon size={24} />
                  <span className="font-bold">{method.label}</span>
                </div>
                <p className={`text-sm ${
                  selectedMethod === method.id
                    ? "text-white/80"
                    : "text-gray-600"
                }`}>
                  {method.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Payment Details Form - Show based on selected method */}
      {selectedMethod && (
        <div className="mt-6 p-5 bg-blue-50 rounded-2xl border border-blue-200">
          {selectedMethod === "card" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === "wallet" && (
            <div>
              <p className="text-gray-700 font-medium mb-4">
                You'll be redirected to your digital wallet to complete the payment.
              </p>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-white rounded-lg border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition">
                  Google Pay
                </button>
                <button className="flex-1 px-4 py-2 bg-white rounded-lg border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition">
                  Apple Pay
                </button>
              </div>
            </div>
          )}

          {selectedMethod === "upi" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@upi"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <p className="text-sm text-gray-600 mt-3">
                A payment request will be sent to your registered UPI app.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}