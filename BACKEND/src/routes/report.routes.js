const express = require("express");
const multer = require("multer");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const Report = require("../models/Report");
const Patient = require("../models/PatientDetails");
const { analyseReport } = require("../services/reportAnalysis.service");

/* ──────────────────────────────────────────────
 * Multer — in-memory storage (no disk writes)
 * Max 10 MB, images + PDFs only
 * ────────────────────────────────────────────── */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/bmp",
      "image/tiff",
      "image/webp",
      "application/pdf",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Please upload an image (JPG, PNG) or PDF."), false);
    }
  },
});

/* ──────────────────────────────────────────────
 * Helper: resolve patientId from auth token
 * ────────────────────────────────────────────── */
function getAuthUserId(req) {
  return req.user?.id || req.user?.userId || req.user?._id || null;
}

async function resolvePatient(userId) {
  return Patient.findOne({
    $or: [{ userId }, { user: userId }],
  }).lean();
}

/* ──────────────────────────────────────────────
 * POST /api/reports/upload
 * Upload a report file, extract & interpret kidney parameters, and store.
 * ────────────────────────────────────────────── */
router.post("/upload", requireAuth, upload.single("report"), async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Please attach a report image or PDF." });
    }

    // Resolve patient record
    const patient = await resolvePatient(userId);
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found. Please complete your profile first." });
    }

    // Run the analysis pipeline
    const result = await analyseReport(req.file.buffer, req.file.mimetype, req.file.originalname);

    // Optional: client can send a reportDate (ISO string) if printed on the report
    const reportDate = req.body.reportDate ? new Date(req.body.reportDate) : new Date();

    // Persist
    const report = await Report.create({
      patientId: patient._id,
      userId,
      parameters: result.parameters,
      summary: result.summary,
      dialysis_risk: result.dialysis_risk,
      recommendation: result.recommendation,
      note: result.note,
      symptom_alert: result.symptom_alert,
      originalFileName: req.file.originalname,
      fileType: result.fileType,
      rawExtractedText: result.rawText,
      reportDate,
    });

    return res.status(201).json({
      message: "Report analysed and saved successfully",
      report,
    });
  } catch (err) {
    console.error("POST /api/reports/upload error:", err);

    // Multer-specific error
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    }

    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

/* ──────────────────────────────────────────────
 * GET /api/reports/history
 * Fetch all reports for the logged-in patient (newest first).
 * ────────────────────────────────────────────── */
router.get("/history", requireAuth, async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const reports = await Report.find({ userId })
      .sort({ reportDate: -1 })
      .select("-rawExtractedText") // omit large text blob
      .lean();

    return res.status(200).json({ reports });
  } catch (err) {
    console.error("GET /api/reports/history error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

/* ──────────────────────────────────────────────
 * GET /api/reports/latest
 * Fetch the single most recent report for dashboard display.
 * ────────────────────────────────────────────── */
router.get("/latest", requireAuth, async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const report = await Report.findOne({ userId })
      .sort({ reportDate: -1 })
      .select("-rawExtractedText")
      .lean();

    if (!report) {
      return res.status(404).json({ message: "No reports found" });
    }

    return res.status(200).json({ report });
  } catch (err) {
    console.error("GET /api/reports/latest error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

/* ──────────────────────────────────────────────
 * GET /api/reports/:id
 * Fetch a single report by its _id (owner only).
 * ────────────────────────────────────────────── */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const report = await Report.findById(req.params.id).lean();
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Ownership check
    if (String(report.userId) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden: not your report" });
    }

    return res.status(200).json({ report });
  } catch (err) {
    console.error("GET /api/reports/:id error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

/* ──────────────────────────────────────────────
 * DELETE /api/reports/:id
 * Delete a report (owner only).
 * ────────────────────────────────────────────── */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const report = await Report.findById(req.params.id).lean();
    if (!report) return res.status(404).json({ message: "Report not found" });

    if (String(report.userId) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden: not your report" });
    }

    await Report.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/reports/:id error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
