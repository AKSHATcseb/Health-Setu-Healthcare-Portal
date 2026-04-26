/**
 * reportAnalysis.service.js
 * ─────────────────────────
 * Complete pipeline: file → text extraction → parameter parsing → clinical interpretation.
 *
 * Clinical rules are derived from the Kidney Function and Dialysis Guide
 * (KDIGO 2024 guidelines) bundled with the project.
 */

const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const path = require("path");

/* ──────────────────────────────────────────────
 * 1. TEXT EXTRACTION
 * ────────────────────────────────────────────── */

/**
 * Extract text from an image buffer using Tesseract.js OCR.
 */
async function extractTextFromImage(buffer) {
  const {
    data: { text },
  } = await Tesseract.recognize(buffer, "eng", {
    // Disable logging in production; enable for debug
    logger: () => {},
  });
  return text;
}

/**
 * Extract text from a PDF buffer using pdf-parse.
 */
async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

/**
 * Determine file type and dispatch to the correct extractor.
 * @param {Buffer} fileBuffer
 * @param {string} mimeType  e.g. "image/png", "application/pdf"
 * @param {string} originalName
 * @returns {{ text: string, fileType: "image"|"pdf"|"unknown" }}
 */
async function extractText(fileBuffer, mimeType, originalName = "") {
  const ext = path.extname(originalName).toLowerCase();

  if (mimeType === "application/pdf" || ext === ".pdf") {
    const text = await extractTextFromPDF(fileBuffer);
    return { text, fileType: "pdf" };
  }

  if (
    mimeType.startsWith("image/") ||
    [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"].includes(ext)
  ) {
    const text = await extractTextFromImage(fileBuffer);
    return { text, fileType: "image" };
  }

  // Fallback: try OCR anyway
  try {
    const text = await extractTextFromImage(fileBuffer);
    return { text, fileType: "unknown" };
  } catch {
    return { text: "", fileType: "unknown" };
  }
}

/* ──────────────────────────────────────────────
 * 2. PARAMETER EXTRACTION (regex + NLP patterns)
 * ────────────────────────────────────────────── */

/**
 * Each entry: { aliases, unit, extract }
 * aliases  — array of regex-safe strings that identify the parameter
 * unit     — default display unit
 * extract  — optional custom regex; otherwise the generic number-after-name pattern is used
 */
const PARAM_DEFINITIONS = [
  {
    key: "urea",
    aliases: [
      "blood urea nitrogen",
      "bun",
      "urea nitrogen",
      "urea",
      "b\\.?u\\.?n",
    ],
    unit: "mg/dL",
    normalRange: "7 – 20 mg/dL",
  },
  {
    key: "creatinine",
    aliases: ["creatinine[,\\s]*serum", "serum creatinine", "creatinine", "s\\.?creatinine", "s\\.?cr"],
    unit: "mg/dL",
    normalRange: "0.6 – 1.3 mg/dL",
  },
  {
    key: "uric_acid",
    aliases: ["uric acid", "uric-acid", "serum uric acid"],
    unit: "mg/dL",
    normalRange: "3.5 – 7.2 mg/dL",
  },
  {
    key: "sodium",
    aliases: ["sodium", "na\\+?", "serum sodium"],
    unit: "mEq/L",
    normalRange: "136 – 145 mEq/L",
  },
  {
    key: "potassium",
    aliases: ["potassium", "k\\+?", "serum potassium"],
    unit: "mEq/L",
    normalRange: "3.5 – 5.0 mEq/L",
  },
  {
    key: "calcium",
    aliases: ["calcium", "ca\\+?", "serum calcium", "total calcium"],
    unit: "mg/dL",
    normalRange: "8.5 – 10.5 mg/dL",
  },
  {
    key: "phosphorus",
    aliases: ["phosphorus", "phosphate", "inorganic phosphorus", "serum phosphorus"],
    unit: "mg/dL",
    normalRange: "2.5 – 4.5 mg/dL",
  },
  {
    key: "albumin",
    aliases: ["albumin", "serum albumin", "s\\.?albumin"],
    unit: "g/dL",
    normalRange: "3.5 – 5.5 g/dL",
  },
  {
    key: "total_protein",
    aliases: ["total protein", "total proteins", "serum protein", "t\\.?protein"],
    unit: "g/dL",
    normalRange: "6.0 – 8.3 g/dL",
  },
];

/**
 * Build a regex for a given parameter definition that captures the numeric value.
 * Pattern:  <alias>  ...stuff...  <number>  (optional unit text)
 */
function buildParamRegex(aliases) {
  const aliasGroup = aliases.join("|");
  // Match: alias → optional colon/comma/spaces → number (with optional decimal)
  // The number can appear after some intervening text (up to ~60 chars to allow lab formatting)
  return new RegExp(
    `(?:${aliasGroup})` +             // parameter name
    `[^\\d]{0,60}?` +                 // bridging characters (colon, spaces, units text …)
    `(\\d+\\.?\\d*)`,                 // captured numeric value
    "i"
  );
}

/**
 * Extract renal parameters from raw text.
 * @param {string} rawText
 * @returns {Object}  e.g. { urea: { value: 55, unit: "mg/dL", normalRange: "…" }, … }
 */
function extractParameters(rawText) {
  const results = {};

  for (const def of PARAM_DEFINITIONS) {
    const regex = buildParamRegex(def.aliases);
    const match = rawText.match(regex);

    if (match && match[1]) {
      const num = parseFloat(match[1]);
      if (!isNaN(num) && num > 0 && num < 10000) {
        // Sanity range — lab values shouldn't exceed a few thousand
        results[def.key] = {
          value: num,
          unit: def.unit,
          normalRange: def.normalRange,
        };
      }
    }

    // If not found, leave undefined (will become { status: "Not Found" } later)
  }

  return results;
}

/* ──────────────────────────────────────────────
 * 3. CLINICAL INTERPRETATION ENGINE
 * ────────────────────────────────────────────── */

/**
 * Classify individual parameter values.
 * Based on KDIGO 2024 guidelines + project-specific rules.
 */
function interpretCreatinine(val) {
  if (val === null || val === undefined) return "Not Found";
  if (val <= 1.2) return "Normal";
  if (val <= 1.5) return "Slightly High";
  if (val <= 3.0) return "Moderate";
  if (val <= 5.0) return "High";
  if (val <= 10.0) return "Critical";
  return "Critical"; // > 10
}

function interpretUrea(val) {
  if (val === null || val === undefined) return "Not Found";
  if (val <= 40) return "Normal";
  if (val <= 60) return "Mildly High";
  if (val <= 100) return "High";
  return "Critical"; // > 100 — uremia risk
}

function interpretUricAcid(val) {
  if (val === null || val === undefined) return "Not Found";
  if (val <= 7.2) return "Normal";
  if (val <= 9.0) return "Slightly High";
  return "High";
}

function interpretSodium(val) {
  if (val === null || val === undefined) return "Not Found";
  if (val < 136) return "Low";
  if (val <= 145) return "Normal";
  return "High";
}

function interpretPotassium(val) {
  if (val === null || val === undefined) return "Not Found";
  if (val < 3.5) return "Low";
  if (val <= 5.0) return "Normal";
  if (val <= 5.5) return "Slightly High";
  if (val <= 6.5) return "High";
  return "Critical"; // > 6.5 — cardiac risk
}

function interpretCalcium(val) {
  if (val === null || val === undefined) return "Not Found";
  if (val < 8.5) return "Low";
  if (val <= 10.5) return "Normal";
  return "High";
}

function interpretPhosphorus(val) {
  if (val === null || val === undefined) return "Not Found";
  if (val < 2.5) return "Low";
  if (val <= 4.5) return "Normal";
  return "High";
}

function interpretAlbumin(val) {
  if (val === null || val === undefined) return "Not Found";
  if (val < 3.5) return "Low";
  if (val <= 5.5) return "Normal";
  return "High";
}

function interpretTotalProtein(val) {
  if (val === null || val === undefined) return "Not Found";
  if (val < 6.0) return "Low";
  if (val <= 8.3) return "Normal";
  return "High";
}

const INTERPRETERS = {
  urea: interpretUrea,
  creatinine: interpretCreatinine,
  uric_acid: interpretUricAcid,
  sodium: interpretSodium,
  potassium: interpretPotassium,
  calcium: interpretCalcium,
  phosphorus: interpretPhosphorus,
  albumin: interpretAlbumin,
  total_protein: interpretTotalProtein,
};

/**
 * Apply clinical interpretation to all extracted parameters.
 * Returns the full parameters object (with status attached) + summary/dialysis assessment.
 */
function interpretReport(extractedParams) {
  const interpreted = {};

  // Apply individual interpreters
  for (const def of PARAM_DEFINITIONS) {
    const raw = extractedParams[def.key];
    const val = raw?.value ?? null;
    const interpreter = INTERPRETERS[def.key];
    const status = interpreter ? interpreter(val) : "Not Found";

    interpreted[def.key] = {
      value: val,
      unit: raw?.unit || def.unit,
      status,
      normalRange: raw?.normalRange || def.normalRange,
    };
  }

  // ─── Dialysis Decision Logic ────────────────────
  const creatVal = interpreted.creatinine.value;
  const ureaVal = interpreted.urea.value;

  let dialysis_risk = "Unknown";
  let recommendation = "";
  let summary = "";

  // Only assess if we have at least one of the key values
  if (creatVal !== null || ureaVal !== null) {
    const creatSafe = creatVal ?? 0;
    const ureaSafe = ureaVal ?? 0;

    if (creatSafe > 5 || ureaSafe > 100) {
      dialysis_risk = "High";
      recommendation =
        "Dialysis evaluation may be required. Please consult a nephrologist immediately.";
      summary =
        "Severe kidney dysfunction indicators detected. Critical values suggest advanced renal impairment.";
    } else if (
      (creatSafe >= 2 && creatSafe <= 5) ||
      (ureaSafe >= 60 && ureaSafe <= 100)
    ) {
      dialysis_risk = "Medium";
      recommendation =
        "Monitor closely and consult a doctor. Regular follow-up kidney function tests are advised.";
      summary =
        "Moderate kidney dysfunction detected. Values suggest declining renal function that needs monitoring.";
    } else if (creatSafe < 2 && ureaSafe < 60) {
      dialysis_risk = "Low";
      recommendation =
        "No dialysis needed at this time. Continue routine monitoring and maintain a healthy lifestyle.";
      summary = "Kidney function appears within acceptable range based on available values.";
    }

    // Refine summary for specific abnormalities
    const abnormals = Object.entries(interpreted).filter(
      ([, v]) => v.status !== "Normal" && v.status !== "Not Found"
    );

    if (abnormals.length === 0 && dialysis_risk === "Low") {
      summary = "All detected kidney parameters are within normal limits.";
    } else if (abnormals.length > 0 && dialysis_risk === "Low") {
      summary = `Mild deviations detected in ${abnormals.map(([k]) => k.replace(/_/g, " ")).join(", ")}. Overall kidney function appears acceptable.`;
    }
  } else {
    summary = "Insufficient renal parameters detected in the report to provide a complete assessment.";
    recommendation = "Please upload a clearer report or one containing kidney function test values.";
  }

  // ─── Symptom Alert ────────────────────
  let symptom_alert = "";
  if (dialysis_risk === "Medium" || dialysis_risk === "High") {
    symptom_alert =
      "Important: Watch for symptoms such as swelling (especially in legs/face), reduced urine output, persistent fatigue, nausea, and shortness of breath. Report these to your doctor immediately.";
  }

  // ─── Albumin-specific alert ────────────────────
  if (interpreted.albumin.value !== null && interpreted.albumin.value < 3.5) {
    const albNote = "Low albumin detected — may indicate nutritional deficiency or kidney protein loss (nephrotic syndrome). Consult your doctor.";
    symptom_alert = symptom_alert ? `${symptom_alert}\n${albNote}` : albNote;
  }

  return {
    parameters: interpreted,
    summary,
    dialysis_risk,
    recommendation,
    symptom_alert,
    note: "This is not a medical diagnosis. Always consult a qualified nephrologist for clinical decisions.",
  };
}

/* ──────────────────────────────────────────────
 * 4. FULL PIPELINE
 * ────────────────────────────────────────────── */

/**
 * Analyse a report file end-to-end.
 * @param {Buffer} fileBuffer
 * @param {string} mimeType
 * @param {string} originalName
 * @returns {Promise<{ rawText, fileType, interpretation }>}
 */
async function analyseReport(fileBuffer, mimeType, originalName) {
  // Step 1: Extract text
  const { text: rawText, fileType } = await extractText(fileBuffer, mimeType, originalName);

  // Step 2: Extract parameters
  const extractedParams = extractParameters(rawText);

  // Step 3: Interpret
  const interpretation = interpretReport(extractedParams);

  return {
    rawText,
    fileType,
    ...interpretation,
  };
}

module.exports = {
  extractText,
  extractParameters,
  interpretReport,
  analyseReport,
};
