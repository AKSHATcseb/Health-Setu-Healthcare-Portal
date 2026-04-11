function validateHospitalPayload(payload) {
  const errors = {};

  // hospitalName required, min length 3
  if (!payload.hospitalName || String(payload.hospitalName).trim().length < 3) {
    errors.hospitalName = "Hospital name must be at least 3 characters";
  }

  // phone optional but if present must be 10 digits
  if (payload.phone) {
    const digits = String(payload.phone).replace(/\D/g, "");
    if (!/^[0-9]{10}$/.test(digits)) {
      errors.phone = "Phone must be 10 digits";
    }
  }

  // registrationNumber: optional but if present must be 3-64 chars alnum/space/hyphen
  if (payload.registrationNumber !== undefined && payload.registrationNumber !== null) {
    const reg = String(payload.registrationNumber).trim();
    if (reg.length > 0 && !/^[A-Za-z0-9\- ]{3,64}$/.test(reg)) {
      errors.registrationNumber =
        "Registration number must be 3-64 chars and may include letters, numbers, spaces or hyphens";
    }
  }

  // dialysisSeats if present must be a non-negative number
  if (payload.dialysisSeats !== undefined && payload.dialysisSeats !== null) {
    if (Number.isNaN(Number(payload.dialysisSeats)) || Number(payload.dialysisSeats) < 0) {
      errors.dialysisSeats = "Dialysis seats must be a valid non-negative number";
    }
  }

  // accountNumber/ifsc basic checks (optional)
  if (payload.accountNumber && String(payload.accountNumber).trim().length < 6) {
    errors.accountNumber = "Account number looks too short";
  }
  if (payload.ifscCode && !/^[A-Za-z]{4}[0-9A-Za-z]{7}$/.test(payload.ifscCode.trim())) {
    // simple Indian IFSC pattern check; adjust or remove as needed
    errors.ifscCode = "Invalid IFSC code format";
  }

  return errors;
}

module.exports = { validateHospitalPayload };