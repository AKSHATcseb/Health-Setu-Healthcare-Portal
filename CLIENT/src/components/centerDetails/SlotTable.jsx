export default function SlotTable() {
  const slots = [
    { time: "10:00 AM", doctor: "Dr. Sharma", type: "Standard" },
    { time: "02:30 PM", doctor: "Dr. A. Mehta", type: "Premium" },
    { time: "05:00 PM", doctor: "Dr. R. Kapoor", type: "Standard" },
  ];

  return (
    <div className="px-2 rounded-2xl py-4">
      <h2 className="text-xl font-bold mb-4">Upcoming Slots</h2>

      <div className="bg-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {slots.map((slot, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <p className="font-semibold">{slot.time}</p>
              <p className="text-sm text-gray-500">{slot.doctor}</p>
            </div>

            <span className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full">
              {slot.type}
            </span>

            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
              Book Slot
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
