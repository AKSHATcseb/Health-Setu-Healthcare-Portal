export default function DateTimeSelector({ onChange }) {
  return (
    <div className="bg-white rounded-2xl p-5 border">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label className="text-sm text-gray-600">
            Select Date
          </label>
          <input
            type="date"
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        {/* Time */}
        <div>
          <label className="text-sm text-gray-600">
            Select Time
          </label>
          <select
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option>Select Time Slot</option>
            <option>07:00 AM</option>
            <option>09:00 AM</option>
            <option>11:00 AM</option>
          </select>
        </div>
      </div>
    </div>
  );
}
