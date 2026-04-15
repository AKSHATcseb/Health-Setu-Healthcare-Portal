const cron = require("node-cron");
const Machine = require("../models/Machine");

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

/* CRON JOB */
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily slot update...");

  try {
    const today = getToday();
    const newDate = getDateAfterDays(7);

    const machines = await Machine.find();

    for (const machine of machines) {
      /* STEP 2.1 → Remove past dates */
      machine.slots = machine.slots.filter(
        (slot) => slot.date >= today
      );

      /* STEP 2.2 → Add new date (today + 7) */
      const exists = machine.slots.some(
        (slot) => slot.date === newDate
      );

      if (!exists) {
        const newSlots = generateSlotsForDate(newDate);
        machine.slots.push(...newSlots);
      }

      await machine.save();
    }

    console.log("Slots updated successfully");
  } catch (err) {
    console.error(err);
  }
});