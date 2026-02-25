export default function PreferencesForm() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">
        Preferences (Optional)
      </h2>

      <select className="w-full mb-3 bg-gray-200 rounded-xl px-4 py-3 text-gray-600">
        <option>Dialysis Type</option>
        <option>Hemodialysis</option>
        <option>Peritoneal</option>
      </select>

      <textarea
        rows="3"
        placeholder="Any special instructions (wheelchair, elderly care, etc.)"
        className="w-full bg-gray-200 rounded-xl px-4 py-3 text-gray-600"
      />
    </div>
  );
}
