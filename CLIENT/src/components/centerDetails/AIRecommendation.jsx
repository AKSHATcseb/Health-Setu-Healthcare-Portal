export default function AIRecommendation() {
  return (
    <div className="mt-6 bg-teal-50 border border-teal-100 rounded-2xl p-5 flex gap-3">
      <span className="text-teal-600">🤖</span>
      <p className="text-sm text-gray-700">
        Based on your profile, this center is a
        <span className="font-semibold text-teal-700"> 98% match</span>.
        It offers senior-friendly care and immediate availability.
      </p>
    </div>
  );
}
