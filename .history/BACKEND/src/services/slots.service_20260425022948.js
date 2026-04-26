const mongoose = require("mongoose");

async function updateMachineSlots() {
  const Machine = mongoose.model("Machine");
  const Hospital = mongoose.model("Hospital");

//   const today = new Date().toISOString().split("T")[0];
const today = formatLocalDate(new Date());

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  const newDate = futureDate.toISOString().split("T")[0];

  const machines = await Machine.find();

  for (const machine of machines) {

    machine.slots = (machine.slots || []).filter(
      (slot) => new Date(slot.date) >= new Date(today)
    );

    const exists = machine.slots.some((s) => s.date === newDate);
    if (exists) continue;

    const hospital = await Hospital.findById(machine.hospitalId);

    // 🔴 ADD THIS SAFETY CHECK (you missed it)
    if (!hospital) {
      console.warn(`Hospital not found for machine ${machine._id}`);
      continue;
    }

    const timings = [
      ...(hospital.slots?.slots4h || []),
      ...(hospital.slots?.slots6h || []),
    ];

    if (!timings.length) {
      console.warn(`No timings for hospital ${hospital._id}`);
      continue;
    }

    const newSlots = timings.map((t) => ({
      date: newDate,
      startTime: t.start,
      endTime: t.end,
      availability_status: "available",
    }));

    machine.slots.push(...newSlots);

    await machine.save();
  }

  console.log("✅ Machine slots updated");
}

module.exports = { updateMachineSlots };