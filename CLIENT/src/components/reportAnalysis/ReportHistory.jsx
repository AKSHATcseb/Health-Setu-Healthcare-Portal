import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Clock,
  TrendingUp,
  ChevronRight,
  FileText,
  Trash2,
} from "lucide-react";

const PARAM_COLORS = {
  creatinine: "#ef4444",
  urea: "#f59e0b",
  albumin: "#a855f7",
  potassium: "#22c55e",
  sodium: "#3b82f6",
  calcium: "#06b6d4",
  uric_acid: "#ec4899",
  phosphorus: "#14b8a6",
  total_protein: "#8b5cf6",
};

const PARAM_LABELS = {
  urea: "Urea",
  creatinine: "Creatinine",
  uric_acid: "Uric Acid",
  sodium: "Sodium",
  potassium: "Potassium",
  calcium: "Calcium",
  phosphorus: "Phosphorus",
  albumin: "Albumin",
  total_protein: "Total Protein",
};

const RISK_BADGE = {
  Low: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  Medium: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
  High: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
  Unknown: { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
};

/**
 * Build trend data for recharts from an array of reports (newest-first → reversed for chronological).
 */
function buildTrendData(reports) {
  const chronological = [...reports].reverse();
  return chronological.map((r) => {
    const point = {
      date: new Date(r.reportDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    };
    for (const key of Object.keys(PARAM_LABELS)) {
      const val = r.parameters?.[key]?.value;
      if (val !== null && val !== undefined) point[key] = val;
    }
    return point;
  });
}

/* ─── Custom Tooltip ─── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid rgba(148,163,184,0.2)",
        borderRadius: "0.5rem",
        padding: "0.75rem 1rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.8rem", margin: "0 0 0.5rem" }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, fontSize: "0.75rem", margin: "0.15rem 0" }}>
          {PARAM_LABELS[entry.name] || entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function ReportHistory({ reports, onSelect, onDelete }) {
  const [selectedParams, setSelectedParams] = useState(["creatinine", "urea"]);

  if (!reports || reports.length === 0) {
    return (
      <div
        style={{
          background: "rgba(30,41,59,0.5)",
          borderRadius: "1rem",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <Clock size={48} color="#475569" style={{ margin: "0 auto 1rem" }} />
        <p style={{ color: "#94a3b8", fontSize: "1rem", fontWeight: 500 }}>
          No reports yet. Upload your first medical report to start tracking.
        </p>
      </div>
    );
  }

  const trendData = buildTrendData(reports);
  const hasChartData = trendData.length >= 2;

  const toggleParam = (key) => {
    setSelectedParams((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key]
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* ─── Trend Chart ─── */}
      {hasChartData && (
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: "1rem",
            padding: "1.5rem",
            border: "1px solid rgba(148,163,184,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <TrendingUp size={20} color="#38bdf8" />
            <h3 style={{ color: "#e2e8f0", fontWeight: 700, margin: 0, fontSize: "1rem" }}>
              Parameter Trends Over Time
            </h3>
          </div>

          {/* Parameter selector chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem",
              marginBottom: "1rem",
            }}
          >
            {Object.entries(PARAM_LABELS).map(([key, label]) => {
              const active = selectedParams.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleParam(key)}
                  style={{
                    background: active ? `${PARAM_COLORS[key]}22` : "rgba(51,65,85,0.5)",
                    border: `1px solid ${active ? PARAM_COLORS[key] : "rgba(100,116,139,0.2)"}`,
                    borderRadius: "999px",
                    padding: "0.3rem 0.7rem",
                    color: active ? PARAM_COLORS[key] : "#94a3b8",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(148,163,184,0.15)" }}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(148,163,184,0.15)" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "0.7rem", color: "#94a3b8" }}
                  formatter={(value) => PARAM_LABELS[value] || value}
                />
                {selectedParams.map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={PARAM_COLORS[key]}
                    strokeWidth={2}
                    dot={{ r: 4, fill: PARAM_COLORS[key] }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ─── Report List ─── */}
      <div>
        <h3
          style={{
            color: "#e2e8f0",
            fontWeight: 700,
            margin: "0 0 1rem",
            fontSize: "1rem",
          }}
        >
          Report History ({reports.length})
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {reports.map((report) => {
            const badge = RISK_BADGE[report.dialysis_risk] || RISK_BADGE.Unknown;
            const date = new Date(report.reportDate);
            const dateStr = date.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            // Count detected params
            const detected = Object.values(report.parameters || {}).filter(
              (p) => p.status !== "Not Found"
            ).length;

            return (
              <div
                key={report._id}
                style={{
                  background: "rgba(30,41,59,0.6)",
                  border: "1px solid rgba(148,163,184,0.08)",
                  borderRadius: "0.75rem",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => onSelect && onSelect(report)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(30,41,59,0.85)";
                  e.currentTarget.style.borderColor = "rgba(56,189,248,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(30,41,59,0.6)";
                  e.currentTarget.style.borderColor = "rgba(148,163,184,0.08)";
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "0.5rem",
                    background: "rgba(14,165,233,0.12)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={20} color="#38bdf8" />
                </div>

                {/* Info */}
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
                    {report.originalFileName || "Medical Report"}
                  </p>
                  <p style={{ color: "#64748b", fontSize: "0.75rem", margin: "0.2rem 0 0" }}>
                    {dateStr} • {detected} parameters
                  </p>
                </div>

                {/* Risk badge */}
                <span
                  style={{
                    background: badge.bg,
                    color: badge.color,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.6rem",
                    borderRadius: "999px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    flexShrink: 0,
                  }}
                >
                  {report.dialysis_risk}
                </span>

                {/* Delete */}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(report._id);
                    }}
                    aria-label="Delete report"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "none",
                      borderRadius: "0.4rem",
                      padding: "0.4rem",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                )}

                <ChevronRight size={16} color="#475569" style={{ flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
