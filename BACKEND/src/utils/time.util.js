/**
 * ✅ Convert "09:30" → Minutes
 */
function timeToMinutes(time) {
  if (!time || !time.includes(":")) return null;

  const [h, m] = time.split(":").map(Number);

  if (isNaN(h) || isNaN(m)) return null;

  return h * 60 + m;
}

/**
 * ✅ Convert Minutes → "HH:MM"
 */
function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * ✅ Calculate End Time
 */
function calculateEndTime(startTime, durationHours) {
  const startMin = timeToMinutes(startTime);

  if (startMin === null) {
    throw new Error("Invalid startTime format");
  }

  const endMin = startMin + durationHours * 60;

  return minutesToTime(endMin);
}

module.exports = {
  timeToMinutes,
  minutesToTime,
  calculateEndTime,
};