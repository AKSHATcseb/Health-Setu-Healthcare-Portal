import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Activity,
  Heart,
} from "lucide-react";

/* ─── Utility: status → color mapping ─── */
const STATUS_COLORS = {
  Normal: { bg: "rgba(34,197,94,0.12)", border: "#22c55e", text: "#4ade80", dot: "#22c55e" },
  "Slightly High": { bg: "rgba(251,191,36,0.12)", border: "#f59e0b", text: "#fbbf24", dot: "#f59e0b" },
  "Mildly High": { bg: "rgba(251,191,36,0.12)", border: "#f59e0b", text: "#fbbf24", dot: "#f59e0b" },
  Moderate: { bg: "rgba(249,115,22,0.12)", border: "#f97316", text: "#fb923c", dot: "#f97316" },
  High: { bg: "rgba(239,68,68,0.12)", border: "#ef4444", text: "#f87171", dot: "#ef4444" },
  Critical: { bg: "rgba(220,38,38,0.18)", border: "#dc2626", text: "#fca5a5", dot: "#dc2626" },
  Low: { bg: "rgba(168,85,247,0.12)", border: "#a855f7", text: "#c084fc", dot: "#a855f7" },
  "Not Found": { bg: "rgba(100,116,139,0.1)", border: "#64748b", text: "#94a3b8", dot: "#64748b" },
};

const RISK_CONFIG = {
  Low: { icon: CheckCircle2, color: "#22c55e", bgGrad: "linear-gradient(135deg,rgba(34,197,94,0.15),rgba(34,197,94,0.05))" },
  Medium: { icon: AlertTriangle, color: "#f59e0b", bgGrad: "linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.05))" },
  High: { icon: ShieldAlert, color: "#ef4444", bgGrad: "linear-gradient(135deg,rgba(239,68,68,0.15),rgba(239,68,68,0.05))" },
  Unknown: { icon: Info, color: "#64748b", bgGrad: "linear-gradient(135deg,rgba(100,116,139,0.15),rgba(100,116,139,0.05))" },
};

const PARAM_LABELS = {
  urea: "Urea (BUN)",
  creatinine: "Creatinine",
  uric_acid: "Uric Acid",
  sodium: "Sodium",
  potassium: "Potassium",
  calcium: "Calcium",
  phosphorus: "Phosphorus",
  albumin: "Albumin",
  total_protein: "Total Protein",
};

const PARAM_ICONS = {
  urea: Activity,
  creatinine: Stethoscope,
  uric_acid: Activity,
  sodium: Heart,
  potassium: Heart,
  calcium: Activity,
  phosphorus: Activity,
  albumin: Stethoscope,
  total_protein: Stethoscope,
};

export default function ReportResults({ report }) {
  const [showAll, setShowAll] = useState(false);

  if (!report) return null;

  const { parameters, summary, dialysis_risk, recommendation, note, symptom_alert } = report;
  const risk = RISK_CONFIG[dialysis_risk] || RISK_CONFIG.Unknown;
  const RiskIcon = risk.icon;

  // Separate found vs not-found parameters
  const entries = Object.entries(parameters || {});
  const found = entries.filter(([, v]) => v.status !== "Not Found");
  const notFound = entries.filter(([, v]) => v.status === "Not Found");
  const displayParams = showAll ? entries : found;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* ─── Dialysis Risk Banner ─── */}
      <div
        style={{
          background: risk.bgGrad,
          border: `1px solid ${risk.color}33`,
          borderRadius: "1rem",
          padding: "1.5rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: `${risk.color}22`,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <RiskIcon size={24} color={risk.color} />
        </div>
        <div>
          <p
            style={{
              color: risk.color,
              fontWeight: 700,
              fontSize: "1.1rem",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Dialysis Risk: {dialysis_risk}
          </p>
          <p style={{ color: "#cbd5e1", fontSize: "0.9rem", margin: "0.5rem 0 0" }}>
            {recommendation}
          </p>
        </div>
      </div>

      {/* ─── Summary ─── */}
      <div
        style={{
          background: "rgba(30,41,59,0.6)",
          borderRadius: "0.75rem",
          padding: "1.25rem",
          border: "1px solid rgba(148,163,184,0.1)",
        }}
      >
        <p style={{ color: "#e2e8f0", fontWeight: 600, margin: "0 0 0.5rem", fontSize: "1rem" }}>
          Clinical Summary
        </p>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>
          {summary}
        </p>
      </div>

      {/* ─── Parameter Cards ─── */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <p style={{ color: "#e2e8f0", fontWeight: 600, margin: 0, fontSize: "1rem" }}>
            Extracted Parameters ({found.length} detected)
          </p>
          {notFound.length > 0 && (
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                background: "none",
                border: "none",
                color: "#38bdf8",
                cursor: "pointer",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              {showAll ? "Hide missing" : `Show all (${notFound.length} missing)`}
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {displayParams.map(([key, param]) => {
            const colors = STATUS_COLORS[param.status] || STATUS_COLORS["Not Found"];
            const Icon = PARAM_ICONS[key] || Activity;
            const isNotFound = param.status === "Not Found";

            return (
              <div
                key={key}
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}33`,
                  borderRadius: "0.75rem",
                  padding: "1rem 1.25rem",
                  opacity: isNotFound ? 0.5 : 1,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 6px 20px ${colors.border}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Icon size={16} color={colors.text} />
                    <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.85rem" }}>
                      {PARAM_LABELS[key] || key}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: colors.text,
                      background: `${colors.border}20`,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "999px",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {param.status}
                  </span>
                </div>

                <div style={{ marginTop: "0.75rem" }}>
                  {isNotFound ? (
                    <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>
                      Not detected in report
                    </p>
                  ) : (
                    <>
                      <p style={{ color: "#f8fafc", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                        {param.value}
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 400, marginLeft: "0.35rem" }}>
                          {param.unit}
                        </span>
                      </p>
                      {param.normalRange && (
                        <p style={{ color: "#64748b", fontSize: "0.7rem", margin: "0.25rem 0 0" }}>
                          Normal: {param.normalRange}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Symptom Alert ─── */}
      {symptom_alert && (
        <div
          style={{
            background: "rgba(249,115,22,0.08)",
            border: "1px solid rgba(249,115,22,0.2)",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
          }}
        >
          <AlertTriangle size={20} color="#f97316" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: "#fdba74", fontSize: "0.85rem", margin: 0, lineHeight: 1.6, whiteSpace: "pre-line" }}>
            {symptom_alert}
          </p>
        </div>
      )}

      {/* ─── Disclaimer ─── */}
      <div
        style={{
          background: "rgba(100,116,139,0.08)",
          border: "1px solid rgba(100,116,139,0.15)",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <Info size={16} color="#94a3b8" />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: 0, fontStyle: "italic" }}>
          {note}
        </p>
      </div>
    </div>
  );
}
