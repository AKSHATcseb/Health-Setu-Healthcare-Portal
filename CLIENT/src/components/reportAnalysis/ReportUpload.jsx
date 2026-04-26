import React, { useState, useRef, useCallback } from "react";
import { Upload, FileText, Image, X, Loader2, AlertCircle } from "lucide-react";

/**
 * ReportUpload — Drag-and-drop + click-to-browse file upload component.
 * Accepts images (JPG, PNG) and PDFs.
 * Calls `onUpload(file)` when the user confirms the upload.
 */
export default function ReportUpload({ onUpload, isUploading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  const ACCEPTED = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

  const validateFile = useCallback(
    (f) => {
      if (!f) return "No file selected.";
      if (!ACCEPTED.includes(f.type)) return "Unsupported format. Please upload JPG, PNG, or PDF.";
      if (f.size > MAX_SIZE) return "File too large. Maximum size is 10 MB.";
      return "";
    },
    []
  );

  const handleFile = useCallback(
    (f) => {
      const err = validateFile(f);
      if (err) {
        setError(err);
        return;
      }
      setError("");
      setFile(f);

      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(f);
      } else {
        setPreview(null);
      }
    },
    [validateFile]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => setDragActive(false), []);

  const handleInputChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (file && onUpload) onUpload(file);
  };

  const isPDF = file?.type === "application/pdf";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "1.25rem",
        padding: "2rem",
        border: dragActive
          ? "2px dashed #38bdf8"
          : "2px dashed rgba(148,163,184,0.25)",
        transition: "all 0.3s ease",
        position: "relative",
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleInputChange}
        style={{ display: "none" }}
        id="report-upload-input"
      />

      {!file ? (
        /* ─── Empty state ─── */
        <label
          htmlFor="report-upload-input"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            cursor: "pointer",
            padding: "2rem 0",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 8px 32px rgba(14,165,233,0.25)",
            }}
          >
            <Upload size={32} color="#fff" />
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#e2e8f0",
                fontSize: "1.1rem",
                fontWeight: 600,
                margin: 0,
              }}
            >
              {dragActive ? "Drop your file here" : "Drag & drop your medical report"}
            </p>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.875rem",
                marginTop: "0.5rem",
              }}
            >
              or{" "}
              <span style={{ color: "#38bdf8", textDecoration: "underline" }}>
                browse files
              </span>
            </p>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.75rem",
                marginTop: "0.75rem",
              }}
            >
              Supported formats: JPG, PNG, PDF • Max 10 MB
            </p>
          </div>
        </label>
      ) : (
        /* ─── File selected preview ─── */
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "rgba(30,41,59,0.7)",
              borderRadius: "0.75rem",
              padding: "1rem",
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "0.5rem",
                overflow: "hidden",
                flexShrink: 0,
                background: isPDF
                  ? "linear-gradient(135deg,#ef4444,#dc2626)"
                  : "#1e293b",
                display: "grid",
                placeItems: "center",
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : isPDF ? (
                <FileText size={28} color="#fff" />
              ) : (
                <Image size={28} color="#94a3b8" />
              )}
            </div>

            {/* File info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  color: "#e2e8f0",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: 0 }}>
                {(file.size / 1024).toFixed(1)} KB •{" "}
                {isPDF ? "PDF Document" : "Image"}
              </p>
            </div>

            {/* Remove button */}
            {!isUploading && (
              <button
                onClick={clearFile}
                aria-label="Remove file"
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <X size={18} color="#ef4444" />
              </button>
            )}
          </div>

          {/* Upload button */}
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            style={{
              width: "100%",
              padding: "0.875rem",
              borderRadius: "0.75rem",
              border: "none",
              background: isUploading
                ? "linear-gradient(90deg,#334155,#475569)"
                : "linear-gradient(90deg,#0ea5e9,#6366f1)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: isUploading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: isUploading ? "none" : "0 6px 24px rgba(14,165,233,0.3)",
              transition: "all 0.3s ease",
            }}
          >
            {isUploading ? (
              <>
                <Loader2
                  size={20}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Analysing Report…
              </>
            ) : (
              <>
                <Upload size={20} />
                Analyse Report
              </>
            )}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "0.75rem",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <AlertCircle size={16} color="#ef4444" />
          <span style={{ color: "#fca5a5", fontSize: "0.85rem" }}>{error}</span>
        </div>
      )}

      {/* Spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
