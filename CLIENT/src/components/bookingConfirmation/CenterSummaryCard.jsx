export default function CenterSummaryCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="font-semibold text-lg text-gray-900">
        City Health Dialysis
      </h2>
      <p className="text-sm text-gray-500">
        📍 Sector 45, Gurgaon • 4.2 km away
      </p>

      <div className="flex gap-6 mt-3 text-sm">
        <span>₹1,450 / session</span>
        <span className="text-teal-600">120+ Verified Reviews</span>
      </div>
    </div>
  );
}
