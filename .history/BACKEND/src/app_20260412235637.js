const express = require("express");
const cors = require("cors");
const cron = require("./cron/slotCron");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // use your actual frontend port
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  })
);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/patient", require("./routes/patient.routes"));
app.use("/api/hospital", require("./routes/hospital.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/payment", require("./routes/payment.routes"));
app.use("/api/appointment", require("./routes/newAppointment.routes"));
// app.use("/api/users", require("./routes/user.routes"));
// app.use("/api/machines", require("./routes/machine.routes"));

app.get("/", (req, res) => res.send("Health Setu Backend Running 🚀"));

module.exports = app;