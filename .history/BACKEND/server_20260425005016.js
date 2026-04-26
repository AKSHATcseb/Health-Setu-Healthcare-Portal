require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const cron = require("./src/cron/slotCron");


// Connect Database
connectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT,"0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
