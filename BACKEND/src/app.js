const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/hospitals", require("./routes/hospital.routes"));
app.use("/api/machines", require("./routes/machine.routes"));
app.use("/api/appointments", require("./routes/appointment.routes"));
app.use("/api/patient", require("./routes/patientHospital.routes"));

// Health check
app.get("/", (req, res) => {
  res.send("Health Setu Backend Running 🚀");
});

module.exports = app;
