import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileBarChart2, Upload, Clock } from "lucide-react";

import Navbar from "../../components/patientDashboard/Navbar";
import Footer from "../../components/Footer";
import ReportUpload from "../../components/reportAnalysis/ReportUpload";
import ReportResults from "../../components/reportAnalysis/ReportResults";
import ReportHistory from "../../components/reportAnalysis/ReportHistory";
import api, { setAuthToken } from "../../services/api";
import {
  uploadReport,
  getReportHistory,
  getLatestReport,
  deleteReport,
} from "../../services/reportApi";

const TABS = [
  { key: "upload", label: "Upload Report", icon: Upload },
  { key: "history", label: "Report History", icon: Clock },
];

export default function ReportAnalysis() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ─── Auth + data bootstrap ─── */
  useEffect(() => {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token") ||
      null;
    if (token) setAuthToken(token);

    const bootstrap = async () => {
      setLoading(true);
      try {
        // Fetch patient info (for navbar)
        const pRes = await api.get(`/api/patient/${id}`);
        setPatient(pRes.data?.patientFromPatientModel ?? pRes.data ?? null);

        // Fetch report history
        const hRes = await getReportHistory();
        setReports(hRes.data?.reports || []);
      } catch (err) {
        console.error("Bootstrap error:", err);
        if (err.response?.status === 401) {
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
          setAuthToken(null);
          navigate("/login", { replace: true });
          return;
        }
        setError(err.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) bootstrap();
  }, [id, navigate]);

  /* ─── Upload handler ─── */
  const handleUpload = useCallback(async (file) => {
    setIsUploading(true);
    setError("");
    try {
      const res = await uploadReport(file);
      const newReport = res.data?.report;
      setCurrentReport(newReport);
      setReports((prev) => [newReport, ...prev]);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to analyse report. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  /* ─── Delete handler ─── */
  const handleDelete = useCallback(async (reportId) => {
    if (!window.confirm("Delete this report? This cannot be undone.")) return;
    try {
      await deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r._id !== reportId));
      if (currentReport?._id === reportId) setCurrentReport(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  }, [currentReport]);

  /* ─── Select from history ─── */
  const handleSelectReport = useCallback((report) => {
    setCurrentReport(report);
    setActiveTab("upload"); // switch to show results
  }, []);

  /* ─── User object for Navbar ─── */
  const user = patient
    ? {
        name:
          patient.fullName ||
          `${patient.firstName || ""} ${patient.lastName || ""}`.trim(),
        email: patient.email,
        id: patient.userId,
      }
    : { name: "Patient", email: "", id: "" };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setAuthToken(null);
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid rgba(56,189,248,0.2)",
              borderTopColor: "#38bdf8",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "#94a3b8" }}>Loading report analysis…</p>
          <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #0c1222 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar user={user} onLogout={handleLogout} />

      {/* ─── Header ─── */}
      <div style={{ padding: "2rem 1.5rem 0", maxWidth: 960, margin: "0 auto", width: "100%" }}>
        {/* Back */}
        <button
          onClick={() => navigate(`/patient/dashboard/${id}`)}
          style={{
            background: "none",
            border: "none",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            cursor: "pointer",
            fontSize: "0.85rem",
            marginBottom: "1.5rem",
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 8px 24px rgba(14,165,233,0.2)",
            }}
          >
            <FileBarChart2 size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: "#f8fafc", fontWeight: 800, fontSize: "1.6rem", margin: 0 }}>
              Kidney Report Analysis
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0.2rem 0 0" }}>
              Upload medical reports to extract kidney function parameters & get clinical insights
            </p>
          </div>
        </div>

        {/* ─── Tab Switcher ─── */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            background: "rgba(30,41,59,0.5)",
            borderRadius: "0.75rem",
            padding: "0.3rem",
            marginBottom: "1.5rem",
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1,
                  padding: "0.65rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  background: isActive
                    ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
                    : "transparent",
                  color: isActive ? "#fff" : "#94a3b8",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  transition: "all 0.25s ease",
                }}
              >
                <Icon size={16} />
                {tab.label}
                {tab.key === "history" && reports.length > 0 && (
                  <span
                    style={{
                      background: isActive ? "rgba(255,255,255,0.2)" : "rgba(56,189,248,0.15)",
                      color: isActive ? "#fff" : "#38bdf8",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      padding: "0.1rem 0.4rem",
                      borderRadius: "999px",
                    }}
                  >
                    {reports.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ─── Error ─── */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
              color: "#fca5a5",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </div>
        )}

        {/* ─── Tab Content ─── */}
        <div style={{ paddingBottom: "3rem" }}>
          {activeTab === "upload" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <ReportUpload onUpload={handleUpload} isUploading={isUploading} />
              {currentReport && <ReportResults report={currentReport} />}
            </div>
          )}
          {activeTab === "history" && (
            <ReportHistory
              reports={reports}
              onSelect={handleSelectReport}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <div style={{ marginTop: "auto" }}>
        <Footer />
      </div>
    </div>
  );
}
