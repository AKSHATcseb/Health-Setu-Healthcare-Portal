const cron = require("node-cron");
const mongoose = require("mongoose");

const formatDate = (d) => d.formatLocalDate(new Date());

const generateSlotsForDate = (dateStr, timings) => {
  return timings.map((t) => ({
    date: dateStr,
    startTime: t.start,
    endTime: t.end,
    availability_status: "available",
  }));
};

function startSlotCron() {
  console.log("✅ slotCron initialized");

  cron.schedule("0 0 * * *", async () => {
    console.log("🌙 Midnight cron running:", new Date());

    let Machine, Hospital;

    try {
      Machine = mongoose.model("Machine");
      Hospital = mongoose.model("Hospital");
    } catch (err) {
      console.warn("Models not ready");
      return;
    }

    try {
      const today = new Date();

      const machines = await Machine.find();

      for (const machine of machines) {

        // 🔥 Remove past slots
        machine.slots = (machine.slots || []).filter(
          (slot) => new Date(slot.date) >= today
        );

        const hospital = await Hospital.findById(machine.hospitalId);
        if (!hospital) continue;

        const timings = [
          ...(hospital.slots?.slots4h || []),
          ...(hospital.slots?.slots6h || []),
        ];

        if (!timings.length) continue;

        // 🔥 Ensure next 7 days ALWAYS exist
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(today.getDate() + i);
          const dateStr = formatDate(d);

          const exists = machine.slots.some((s) => s.date === dateStr);

          if (!exists) {
            const newSlots = generateSlotsForDate(dateStr, timings);
            machine.slots.push(...newSlots);
          }
        }

        await machine.save();
      }

      console.log("✅ Slots updated for next 7 days");
    } catch (err) {
      console.error("[slotCron] Error:", err);
    }
  }, {
    timezone: "Asia/Kolkata"
  });
}

module.exports = { startSlotCron };