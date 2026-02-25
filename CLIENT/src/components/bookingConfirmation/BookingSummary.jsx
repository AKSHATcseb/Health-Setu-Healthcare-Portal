export default function BookingSummary() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md sticky top-6">
      <h2 className="font-semibold text-lg mb-4">
        Booking Summary
      </h2>

      <div className="text-sm text-gray-600 space-y-2">
        <p>Center: City Health Dialysis</p>
        <p>Date: Today</p>
        <p>Time: 10:00 AM</p>
        <p className="font-semibold text-gray-900">
          Total: ₹1,450
        </p>
      </div>

      <button
        className="
          w-full mt-6 py-3
          bg-teal-600 text-white rounded-full
          font-semibold hover:bg-teal-700
          transition cursor-pointer
        "
      >
        Confirm Appointment
      </button>
    </div>
  );
}
