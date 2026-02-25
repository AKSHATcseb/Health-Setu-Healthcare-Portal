import { useState, useMemo } from "react";

/* Utilities */
function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hour12 = h % 12 || 12;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export default function SlotSelector({
  openingTime = "09:00",
  closingTime = "22:00",
  slotDuration = 60,
  onSelect,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const categories = [
    { label: "General Dialysis (4 hrs)", hours: 4, emergency: false },
    { label: "Extended Dialysis (6 hrs)", hours: 6, emergency: false },
    { label: "Emergency Dialysis", hours: 6, emergency: true },
  ];

  /* All base slots */
  const baseSlots = useMemo(() => {
    const start = toMinutes(openingTime);
    const end = toMinutes(closingTime);

    const arr = [];
    for (let t = start; t + slotDuration <= end; t += slotDuration) {
      arr.push(t);
    }
    return arr;
  }, [openingTime, closingTime, slotDuration]);

  /* Valid slots based on duration */
  const visibleSlots = useMemo(() => {
    if (!selectedCategory) return [];

    const closeMin = toMinutes(closingTime);
    const needed = selectedCategory.hours * 60;

    return baseSlots.filter(
      (startMin) => startMin + needed <= closeMin
    );
  }, [baseSlots, selectedCategory, closingTime]);

  /* ⛔ Slots to disable AFTER selection */
  const disabledSlots = useMemo(() => {
    if (!selectedSlot || !selectedCategory) return [];

    const index = visibleSlots.indexOf(selectedSlot);
    if (index === -1) return [];

    const blockCount =
      (selectedCategory.hours * 60) / slotDuration;

    // Disable next slots equal to duration
    return visibleSlots.slice(index + 1, index + blockCount);

  }, [selectedSlot, selectedCategory, visibleSlots, slotDuration]);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-6">

      {/* CATEGORY */}
      <div>
        <h2 className="font-semibold text-lg mb-4">
          Select Category
        </h2>

        <div className="grid sm:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSlot(null);
              }}
              className={`
                py-3 rounded-xl text-sm font-medium transition
                ${
                  selectedCategory?.label === cat.label
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 hover:bg-teal-50"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* SLOTS */}
      <div>
        <h2 className="font-semibold text-lg mb-4">
          Select Time Slot
        </h2>

        {!selectedCategory ? (
          <p className="text-sm text-gray-500">
            Please select a patient category first.
          </p>
        ) : (
          <div className="grid sm:grid-cols-3 gap-3">
            {visibleSlots.map((slotMin) => {

              const disabled = disabledSlots.includes(slotMin);
              const formatted = formatTime(slotMin);

              return (
                <button
                  key={slotMin}
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;

                    setSelectedSlot(slotMin);

                    const endMin =
                      slotMin + selectedCategory.hours * 60;

                    onSelect?.({
                      category: selectedCategory.label,
                      durationHours: selectedCategory.hours,
                      isEmergency: selectedCategory.emergency,
                      startTime: formatted,
                      endTime: formatTime(endMin),
                    });
                  }}
                  className={`
                    py-3 rounded-xl border text-sm font-medium transition
                    ${
                      disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : selectedSlot === slotMin
                        ? "bg-teal-600 text-white border-teal-600"
                        : "hover:border-teal-600 hover:bg-teal-50"
                    }
                  `}
                >
                  {formatted}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
