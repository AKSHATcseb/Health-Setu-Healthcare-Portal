const cron = require("node-cron");
const mongoose = require("mongoose");

const Hospital = mongoose.model("Hospital");
const Machine = mongoose.model("Machine");

// Helper: local YYYY-MM-DD
function formatLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Cron: runs daily at 00:05 server time (change as needed).
// schedule format: minute hour day-of-month month day-of-week
// '5 0 * * *' => 00:05 every day
cron.schedule("5 0 * * *", async () => {
  try {
    // Choose startOffset:
    // 0 => include today (window: today .. today+6)
    // 1 => start from tomorrow (window: tomorrow .. tomorrow+6)
    const startOffset = 1; // set to 0 if you want "from today"

    const today = new Date();
    // Normalise today's date according to server timezone
    const formattedToday = formatLocalDate(today);

    console.log(`[slotCron] Starting slot refresh job at ${new Date().toISOString()}`);

    const hospitals = await Hospital.find({}).lean();

    for (const hospital of hospitals) {
      // Merge timings like your generateInitialSlots does
      const timings = [
        ...(hospital.slots?.slots4h || []),
        ...(hospital.slots?.slots6h || []),
      ];
      if (!timings || timings.length === 0) continue;

      // Fetch machines for this hospital
      const machines = await Machine.find({ hospitalId: hospital._id });

      for (const machine of machines) {
        // Keep only future slots (>= startDate)
        const startBase = new Date();
        startBase.setDate(startBase.getDate() + startOffset);
        const startDateStr = formatLocalDate(startBase);

        // Preserve slots that are on or after startDateStr
        const keptSlots = (machine.slots || []).filter((s) => s.date >= startDateStr);

        // Build set of dates already present for quick lookup
        const existingDates = new Set(keptSlots.map((s) => s.date));

        // Add any missing days up to next 7 days (starting from startOffset)
        const newSlots = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() + startOffset + i);
          const fd = formatLocalDate(d);
          if (!existingDates.has(fd)) {
            timings.forEach((time) => {
              newSlots.push({
                date: fd,
                startTime: time,
                availability_status: "available",
              });
            });
          }
        }

        // If we removed old slots or added new slots, save
        const finalSlots = [...keptSlots, ...newSlots];

        // Avoid unnecessary writes
        if (finalSlots.length !== (machine.slots || []).length || newSlots.length > 0) {
          machine.slots = finalSlots;
          machine.markModified("slots");
          await machine.save();
          console.log(`[slotCron] Updated machine ${machine._id} (added ${newSlots.length} slots, kept ${keptSlots.length})`);
        }
      }
    }

    console.log(`[slotCron] Slot refresh job completed at ${new Date().toISOString()}`);
  } catch (err) {
    console.error("[slotCron] Slot refresh failed:", err);
  }
});