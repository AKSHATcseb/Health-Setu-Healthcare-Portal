const User = require("../models/User");

const isPatient = async (req, res, next) => {
  const user = await User.findOne({ firebaseUid: req.user.uid });

  if (!user || user.role !== "patient") {
    return res.status(403).json({ message: "Patient access only" });
  }

  req.dbUser = user;
  next();
};

const isHospitalAdmin = async (req, res, next) => {
  const user = await User.findOne({ firebaseUid: req.user.uid });

  if (!user || user.role !== "hospital_admin") {
    return res.status(403).json({ message: "Hospital Admin access only" });
  }

  req.dbUser = user;
  next();
};

module.exports = { isPatient, isHospitalAdmin };
