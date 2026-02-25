export default function ConsentSection() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <label className="flex items-start gap-3 text-sm text-gray-600">
        <input type="checkbox" />
        I confirm that the above appointment details are correct and
        I consent to share my information with the dialysis center.
      </label>
    </div>
  );
}
