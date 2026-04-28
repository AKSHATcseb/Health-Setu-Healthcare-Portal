import React, { useState } from "react";

export default function SlotSelector({ hospital, onSelectSlot }) {
    const [selectedSlot, setSelectedSlot] = useState(null);

    // const handleSelect = (slot, type) => {
    //     const selected = { slot, type };
    //     setSelectedSlot(selected);
    //     onSelectSlot(selected);
    // };

    const handleSelect = ({ slot, machineId, type }) => {
  setSelectedSlot({ slot, machineId, type });
};

    // 🔥 PROCESS SLOTS
    let slots4h = [];
    let slots6h = [];
    let slotsPD = [];

    if (Array.isArray(hospital?.availableSlots)) {
        const toMinutes = (time) => {
            const [h, m] = time.split(":").map(Number);
            return h * 60 + m;
        };

        const isOverlapping = (s1, e1, s2, e2) => {
            return s1 < e2 && s2 < e1;
        };

        hospital.availableSlots.forEach((slot) => {
            if (!slot) return;
            // console.log("Processing slot:", slot);
            let start, end;

            if (typeof slot === "string") {
                const parts = slot.split(" - ");

                if (parts.length === 2) {
                    start = parts[0];
                    end = parts[1];
                }
            } else if (typeof slot === "object") {
                start = slot.start;
                end = slot.end;
            }

            // console.log("FINAL start:", start);
            // console.log("FINAL end:", end);

            if (!start || !end) return;

            const durationHours =
                (toMinutes(end) - toMinutes(start)) / 60;
            // console.log("Calculated duration for slot:", slot, "is", duration, "hours");

            const formatted = `${start} - ${end}`;
            if (durationHours >= 3.5 && durationHours <= 4.5) {
                slots4h.push(formatted);
            } else if (durationHours >= 5.5 && durationHours <= 6.5) {
                slots6h.push(formatted);
            } else {
                slotsPD.push(formatted);
            }
            // console.log("slots4hr:", slots4h, "slots6hr:", slots6h, "slotsPD:", slotsPD);
        });
    } else if (typeof hospital?.availableSlots === "object") {
        slots4h = hospital.availableSlots.slots4h || [];
        slots6h = hospital.availableSlots.slots6h || [];
        slotsPD = hospital.availableSlots.slotsPD || [];
    }

    const isEmpty =
        slots4h.length === 0 &&
        slots6h.length === 0 &&
        slotsPD.length === 0;

    if (isEmpty) {
        return (
            <div className="bg-white rounded-xl p-4 shadow">
                <p className="text-red-500 text-center">
                    No slots available for this date
                </p>
            </div>
        );
    }

    // 🔥 FORMAT SLOT DISPLAY
    const formatSlot = (slot) => {
        if (typeof slot === "object") {
            return `${slot.start} - ${slot.end}`;
        }
        return slot;
    };

    const renderSection = (title, slots, type) => {
        if (!slots.length) return null;

        return (
            <div className="mb-5">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                    {title}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {machines.map((machine) => (
                        <div key={machine._id} className="mb-4">

                            {/* Machine Heading */}
                            <h3 className="font-semibold mb-2">
                                Machine {machine.machineNumber}
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {machine.slots
                                    .filter(slot => slot.date === selectedDate)
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
                                                        type
                                                    })
                                                }
                                                disabled={slot.availability_status !== "available"}
                                                className={`py-2 px-3 rounded-lg text-sm font-medium border transition
                ${isSelected
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
                    {/* {slots.map((slot, index) => {
                        // console.log("Rendering slot:", slot, "of type:", type);
                        const isSelected =
                            selectedSlot?.slot === slot &&
                            selectedSlot?.type === type;

                        return (
                            <button
                                key={index}
                                onClick={() => handleSelect(slot, type)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium border transition
                  ${isSelected
                                        ? "bg-slate-800 text-white"
                                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-sky-100"
                                    }
                `}
                            >
                                {formatSlot(slot)}
                            </button>
                        );
                    })} */}
                </div>
            </div>
        );
    };

    return (
        <div className="rounded-xl p-7 mb-4 shadow-md">

            <h2 className="text-lg font-bold text-gray-800 mb-4">
                Select Available Slot
            </h2>

            {/* ✅ ORDER: 4h → 6h → PD */}
            {renderSection("4 Hour Sessions", slots4h, "4h")}
            {renderSection("6 Hour Sessions", slots6h, "6h")}
            {renderSection("Peritoneal Dialysis", slotsPD, "pd")}

            {/* Selected Slot */}
            {selectedSlot && (
                <div className="mt-4 text-sm text-gray-700">
                    Selected:{" "}
                    <span className="font-semibold text-green-700">
                        {formatSlot(selectedSlot.slot)} ({selectedSlot.type})
                    </span>
                </div>
            )}
        </div>
    );
}