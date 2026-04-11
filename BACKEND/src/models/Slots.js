const mongoose = require("mongoose");
const { startSession } = require("./HospitalDetails");

const slotSchemaFor4Hrs = new mongoose.Schema(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
  },
  { timestamps: true }
);

const slotSchemaFor6Hrs = new mongoose.Schema(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
  },
  { timestamps: true }
);

const Slot4Hrs = mongoose.model("Slot4Hrs", slotSchemaFor4Hrs);
const Slot6Hrs = mongoose.model("Slot6Hrs", slotSchemaFor6Hrs);

module.exports = { Slot4Hrs, Slot6Hrs };