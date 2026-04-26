import React from "react";
import { Clock } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const FOUR_HOURS_MIN = 4 * 60;
const SIX_HOURS_MIN = 6 * 60;
const GAP_MIN = 45;

function pad(n) {
  return String(n).padStart(2, "0");
}

function minutesFromTimeString(t) {
  if (!t) return null;
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}

function timeStringFromMinutes(mins) {
  const hh = Math.floor(mins / 60);
  const mm = mins % 60;
  return `${pad(hh)}:${pad(mm)}`;
}

function computeSlots(count, firstStart, duration) {
  const slots = [];
  if (!count || count <= 0) return slots;

  let cursor = minutesFromTimeString(firstStart);

  for (let i = 0; i < count; i++) {
    const start = cursor;
    const end = start + duration;

    slots.push({
      start: timeStringFromMinutes(start),
      end: timeStringFromMinutes(end),
    });

    cursor = end + GAP_MIN;
  }

  return slots;
}

export default function OperatingHoursForm({ formData, setFormData }) {
  const safe = {
    operatingHours: { ...(formData?.operatingHours || {}) },
    slots: {
      numberOf4HrsSessionsPerDay: formData?.slots?.numberOf4HrsSessionsPerDay || 0,
      numberOf6HrsSessionsPerDay: formData?.slots?.numberOf6HrsSessionsPerDay || 0,
      firstStart4h: formData?.slots?.firstStart4h || "09:00",
      firstStart6h: formData?.slots?.firstStart6h || "09:00",
      slots4h: formData?.slots?.slots4h || [],
      slots6h: formData?.slots?.slots6h || [],
    },
  };

  const updateSlots = (newSlots) => {
    setFormData({
      ...formData,
      slots: {
        ...safe.slots,
        ...newSlots,
      },
    });
  };

  const handleSlotCountChange = (type, count) => {
    if (type === "4h") {
      const slots = computeSlots(count, safe.slots.firstStart4h, FOUR_HOURS_MIN);

      updateSlots({
        numberOf4HrsSessionsPerDay: count,
        slots4h: slots,
      });
    } else {
      const slots = computeSlots(count, safe.slots.firstStart6h, SIX_HOURS_MIN);

      updateSlots({
        numberOf6HrsSessionsPerDay: count,
        slots6h: slots,
      });
    }
  };

  const handleFirstStartChange = (type, value) => {
    if (type === "4h") {
      const slots = computeSlots(
        safe.slots.numberOf4HrsSessionsPerDay,
        value,
        FOUR_HOURS_MIN
      );

      updateSlots({
        firstStart4h: value,
        slots4h: slots,
      });
    } else {
      const slots = computeSlots(
        safe.slots.numberOf6HrsSessionsPerDay,
        value,
        SIX_HOURS_MIN
      );

      updateSlots({
        firstStart6h: value,
        slots6h: slots,
      });
    }
  };

  const handleWeekdayToggle = (day, checked) => {
    const updated = {
      ...safe.operatingHours,
      [day]: { closed: !checked },
    };

    setFormData({
      ...formData,
      operatingHours: updated,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <Clock />
        <h2 className="font-bold">Operating Hours & Slots</h2>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {DAYS.map((day) => (
          <label key={day}>
            <input
              type="checkbox"
              checked={!safe.operatingHours[day]?.closed}
              onChange={(e) => handleWeekdayToggle(day, e.target.checked)}
            />
            {day.slice(0, 3)}
          </label>
        ))}
      </div>

      {/* 4H Slots */}
      <div className="mb-6">
        <p>4-hour sessions</p>

        <select
          value={safe.slots.numberOf4HrsSessionsPerDay}
          onChange={(e) =>
            handleSlotCountChange("4h", Number(e.target.value))
          }
        >
          {[0, 1, 2, 3, 4].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>

        {safe.slots.numberOf4HrsSessionsPerDay > 0 && (
          <>
            <input
              type="time"
              value={safe.slots.firstStart4h}
              onChange={(e) =>
                handleFirstStartChange("4h", e.target.value)
              }
            />

            {safe.slots.slots4h.map((slot, i) => (
              <div key={i}>
                {slot.start} - {slot.end}
              </div>
            ))}
          </>
        )}
      </div>

      {/* 6H Slots */}
      <div>
        <p>6-hour sessions</p>

        <select
          value={safe.slots.numberOf6HrsSessionsPerDay}
          onChange={(e) =>
            handleSlotCountChange("6h", Number(e.target.value))
          }
        >
          {[0, 1, 2, 3].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>

        {safe.slots.numberOf6HrsSessionsPerDay > 0 && (
          <>
            <input
              type="time"
              value={safe.slots.firstStart6h}
              onChange={(e) =>
                handleFirstStartChange("6h", e.target.value)
              }
            />

            {safe.slots.slots6h.map((slot, i) => (
              <div key={i}>
                {slot.start} - {slot.end}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}