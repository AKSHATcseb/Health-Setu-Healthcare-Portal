require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { startSlotCron } = require("./src/cron/slotCron");

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    // ✅ 1. Connect DB FIRST
    await connectDB();

    // ✅ 2. Load models AFTER DB
    require("./src/models/Hospital");
    require("./src/models/Machine");

    // ✅ 3. Start cron AFTER DB + models
    startSlotCron();

    // ✅ 4. Start server LAST
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
}

startServer();



// require("dotenv").config();
// const app = require("./src/app");
// const connectDB = require("./src/config/db");
// // const cron = require("./src/cron/slotCron");


// // Connect Database
// connectDB();

// const PORT = process.env.PORT || 8080;

// app.listen(PORT,"0.0.0.0", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
