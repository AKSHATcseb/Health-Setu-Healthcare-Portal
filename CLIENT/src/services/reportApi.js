import api from "./api";

/**
 * Upload a medical report file for kidney function analysis.
 * @param {File} file  - The image or PDF file to upload.
 * @param {string} [reportDate] - Optional ISO date string for the report date.
 * @returns {Promise}
 */
export async function uploadReport(file, reportDate) {
  const formData = new FormData();
  formData.append("report", file);
  if (reportDate) formData.append("reportDate", reportDate);

  return api.post("/api/reports/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000, // OCR can take time
  });
}

/**
 * Fetch full report history for the logged-in patient.
 */
export async function getReportHistory() {
  return api.get("/api/reports/history");
}

/**
 * Fetch the most recent report.
 */
export async function getLatestReport() {
  return api.get("/api/reports/latest");
}

/**
 * Fetch a single report by its ID.
 */
export async function getReportById(reportId) {
  return api.get(`/api/reports/${reportId}`);
}

/**
 * Delete a report by its ID.
 */
export async function deleteReport(reportId) {
  return api.delete(`/api/reports/${reportId}`);
}
