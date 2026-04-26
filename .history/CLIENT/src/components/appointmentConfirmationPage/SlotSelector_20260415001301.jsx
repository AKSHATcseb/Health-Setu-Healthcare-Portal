import React, { useState } from "react";

export default function SlotSelector({ hospital, selectedDate, onSelectSlot }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  // ✅ machines from hospital
  const machines = hospital?.machines || [];
  console.log("Machines for hospital:", hospital?._id, machines);

  const handleSelect = ({ slot, machineId, type }) => {
    const selected = { slot, machineId, type };
    setSelectedSlot(selected);
    onSelectSlot(selected); // 🔥 IMPORTANT
  };

  // ✅ date formatter (fix mismatch issue)
  const formatDate = (d) => new Date(d).toISOString().split("T")[0];

  const formatSlot = (time) => time;

  if (!machines.length) {
    return (
      <div className="bg-white rounded-xl p-4 shadow">
        <p className="text-red-500 text-center">
          No machines available
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-7 mb-4 shadow-md">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Select Available Slot
      </h2>

      {machines.map((machine) => (
        <div key={machine._id} className="mb-6">
          {/* Machine Heading */}
          <h3 className="font-semibold mb-2">
            Machine {machine.machineNumber}
          </h3>

          <div className="flex flex-wrap gap-2">
            {machine.slots
              ?.filter(
                (slot) =>
                  formatDate(slot.date) === formatDate(selectedDate)
              )
              .map((slot, index) => {
                const isSelected =
                  selectedSlot?.slot === slot.startTime &&
                  selectedSlot?.machineId === machine._id;

                return (
                  <button
                    key={index}
                    onClick={() =>
                      handleSelect({
                        slot: slot.startTime,
                        machineId: machine._id,
                        type: "dialysis",
                      })
                    }
                    disabled={slot.availability_status !== "available"}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition
                      ${
                        isSelected
                          ? "bg-slate-800 text-white"
                          : slot.availability_status === "available"
                          ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    {formatSlot(slot.startTime)}
                  </button>
                );
              })}
          </div>
        </div>
      ))}

      {/* Selected Slot */}
      {selectedSlot && (
        <div className="mt-4 text-sm text-gray-700">
          Selected:{" "}
          <span className="font-semibold text-green-700">
            {selectedSlot.slot} (Machine {selectedSlot.machineId})
          </span>
        </div>
      )}
    </div>
  );
}