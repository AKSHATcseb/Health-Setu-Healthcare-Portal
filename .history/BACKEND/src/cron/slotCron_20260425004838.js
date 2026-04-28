const cron = require("node-cron");
const mongoose = require("mongoose");
const cron = require("./cron/slotCron");

const getToday = () => new Date().toISOString().split("T")[0];

const getDateAfterDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const generateSlotsForDate = (dateStr, timings) => {
  return timings.map((t) => ({
    date: dateStr,
    startTime: t.start,
    endTime: t.end,
    availability_status: "available",
  }));
};

console.log("✅ slotCron loaded");

cron.schedule("0 0 * * *", async () => {
  console.log("🟢 Running daily slot update...");

  let Machine, Hospital;

  try {
    Machine = mongoose.model("Machine");
    Hospital = mongoose.model("Hospital");
  } catch (err) {
    console.warn("Models not ready");
    return;
  }

  try {
    const today = getToday();
    const newDate = getDateAfterDays(7);

    const machines = await Machine.find();

    for (const machine of machines) {

      machine.slots = (machine.slots || []).filter(
        (slot) => new Date(slot.date) >= new Date(today)
      );

      if (machine.slots.some((s) => s.date === newDate)) continue;

      const hospital = await Hospital.findById(machine.hospitalId);
      if (!hospital) continue;

      const timings = [
        ...(hospital.slots?.slots4h || []),
        ...(hospital.slots?.slots6h || []),
      ];

      if (!timings.length) continue;

      const newSlots = generateSlotsForDate(newDate, timings);

      machine.slots.push(...newSlots);

      await machine.save();
    }

    console.log("✅ Slots updated successfully");
  } catch (err) {
    console.error("[slotCron] Error:", err);
  }
}, {
  timezone: "Asia/Kolkata"
});