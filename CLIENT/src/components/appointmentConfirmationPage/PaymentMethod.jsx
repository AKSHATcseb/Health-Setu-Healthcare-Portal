import React, { useState } from "react";
import api from "../../services/api";
import { Smartphone } from "lucide-react";

export default function PaymentMethod({ hospitalData, selectedSlot }) {
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);

  const priceMap = {
    "4h": "priceFor4Hrs",
    "6h": "priceFor6Hrs",
    "pd": "priceForPD",
  };

  const slotType = selectedSlot?.type;

  const priceType = priceMap[slotType];

  const upiID = hospitalData?.upiID;
  const amount = hospitalData?.[priceType];

  // console.log("slotType:", slotType);
  // console.log("priceType:", priceType);
  // console.log("amount:", amount);

  const generateQR = async () => {
    try {
      if (!upiID || !amount) {
        alert("Missing payment details");
        return;
      }

      setLoading(true);

      const res = await api.post("/api/payment", {
        amount,
        name: hospitalData?.name || "Hospital",
        upiID,
      });

      setQr(res.data.qrCode);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-300 p-7 mb-8 shadow-xl">

      {/* Header */}
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Smartphone size={22} className="text-orange-600" />
        UPI Payment
      </h3>

      <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 space-y-4">

        {/* Show Details */}
        <div className="p-4">
          <p className="text-sm text-gray-600">UPI ID</p>
          <p className="font-semibold text-gray-900 mb-4">{upiID || "Not available"}</p>

          <p className="text-sm text-gray-600">Amount</p>
          <p className="font-semibold text-lg text-green-600">
            ₹{amount || 0}
          </p>
        </div>

        {/* Generate QR */}
        {qr ? (
          <button
            onClick={() => {
              setQr(null);
            }}
            className="w-full bg-gray-500 text-white py-2 rounded-lg"
          >
            Generate Again
          </button>
        ) : (
          <button
            onClick={generateQR}
            disabled={!upiID || !amount || loading}
            className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-semibold border border-blue-700 hover:bg-blue-600 disabled:bg-gray-400 disabled:border-gray-400 transition"
          >
            {loading ? "Generating QR..." : "Confirm & Pay"}
          </button>
        )}

        {/* QR Display */}
        {qr && (
          <div className="text-center mt-4">
            <img
              src={qr}
              alt="UPI QR"
              className="w-56 h-56 mx-auto border rounded-lg"
            />

            <p className="text-sm text-gray-600 mt-3">
              Scan using any UPI app like{" "}
              <span className="font-semibold">
                Google Pay / PhonePe
              </span>
            </p>

            {/* Paid Button */}
            <button className="mt-4 w-full bg-green-500 text-white py-2.5 rounded-lg font-semibold hover:bg-green-600 transition">
              I have paid
            </button>
          </div>
        )}
      </div>
    </div>
  );
}