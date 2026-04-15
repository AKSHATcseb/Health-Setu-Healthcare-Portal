const cron = require("node-cron");
const mongoose = require("mongoose");

/* helper functions */
const getToday = () => new Date().toISOString().split("T")[0];

const getDateAfterDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const generateSlotsForDate = (dateStr) => {
  const timings = ["08:00", "12:00", "16:00"];

  return timings.map((time) => ({
    date: dateStr,
    startTime: time,
    availability_status: "available",
  }));
};

/* CRON JOB - runs daily at midnight server time */
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily slot update...");

  // Resolve models lazily so requiring this file doesn't force model registration order
  let Machine;
  try {
    Machine = mongoose.model("Machine");
  } catch (err) {
    // Machine model not registered yet (or Hospital missing in Machine file) — skip run
    console.warn("[slotCron] Machine model not registered yet. Ensure models are required after DB connect.");
    return;
  }

  try {
    const today = getToday();
    const newDate = getDateAfterDays(7);

    const machines = await Machine.find();

    for (const machine of machines) {
      /* Remove past dates */
      machine.slots = (machine.slots || []).filter((slot) => slot.date >= today);

      /* Add new date (today + 7) if missing */
      const exists = machine.slots.some((slot) => slot.date === newDate);

      if (!exists) {
        const newSlots = generateSlotsForDate(newDate);
        machine.slots.push(...newSlots);
      }

      await machine.save();
    }

    console.log("Slots updated successfully");
  } catch (err) {
    console.error("[slotCron] Error updating slots:", err);
  }
});