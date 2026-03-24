import React, { useEffect, useState } from "react";
import { Search, Loader } from "lucide-react";
import HospitalTable from "../../components/adminPage/HospitalTable";
import HospitalDetailsDrawer from "../../components/adminPage/HospitalDetailsDrawer";
import ConfirmationModal from "../../components/adminPage/ConfirmationModal";
import api, { setAuthToken } from "../../services/api";
import { useNavigate } from "react-router-dom";


/**
 * Frontend admin page wired to backend admin API.
 * Ensure NEXT_PUBLIC_API_URL points to your backend (e.g. http://localhost:4000)
 */
// const API = process.env.NEXT_PUBLIC_API_URL || ""; // set in .env

export default function AdminHospitalsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | accepted | rejected | changes_requested
  const [selected, setSelected] = useState(null); // selected hospital request
  const [modal, setModal] = useState({ open: false, action: null, payload: null });
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError("");

        // SAME LOGIC AS CENTER DASHBOARD
        const token =
          sessionStorage.getItem("token") ||
          localStorage.getItem("token") ||
          null;

        if (token) {
          setAuthToken(token);
        } else {
          setAuthToken(null);
          navigate("/login", { replace: true });
          return;
        }

        // API CALL USING AXIOS INSTANCE
        const res = await api.get("/api/admin/requests");

        setRequests(res.data.data || []);
      } catch (err) {
        console.error("Admin fetch error:", err);

        if (err.response) {
          if (err.response.status === 401) {
            // SAME AS CENTER DASHBOARD
            sessionStorage.removeItem("token");
            localStorage.removeItem("token");
            setAuthToken(null);
            navigate("/login", { replace: true });
            return;
          } else if (err.response.status === 403) {
            setError("Access denied. Admin only.");
          } else {
            setError(err.response.data?.message || "Failed to load requests");
          }
        } else {
          setError("Network error. Check backend.");
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  // Filtered list derived from query + status
  const filtered = requests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (r.hospitalName || "").toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q) ||
      (r.address || "").toLowerCase().includes(q) ||
      (r.registrationNumber || "").toLowerCase().includes(q)
    );
  });

  const openDetails = (item) => setSelected(item);
  const closeDetails = () => setSelected(null);

  const openConfirm = (action, payload) => setModal({ open: true, action, payload });
  const closeConfirm = () => setModal({ open: false, action: null, payload: null });

  // handle status update with backend
  const handleUpdateStatus = async (action, payloadWithNote) => {
    if (!payloadWithNote || !payloadWithNote._id) return;
    console.log("ID:", payloadWithNote._id);
    console.log("Response:", payloadWithNote);
    console.log("ACTION:", action);
    console.log("PAYLOAD:", payloadWithNote);
    setActionLoading(true);

    try {
      const res = await api.patch(
        `/api/admin/requests/${payloadWithNote._id}/status`,
        {
          status: action,
          note: payloadWithNote.note || "",
        },
        console.log("success")
      );

      const updated = res.data.data;

      setRequests((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );

      closeConfirm();
      closeDetails();
    } catch (err) {
      console.error("Status update error:", err);

      if (err.response?.status === 401) {
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        setAuthToken(null);
        navigate("/login", { replace: true });
        return;
      }

      console.error("FULL ERROR:", err.response?.data);
      setError(JSON.stringify(err.response?.data) || "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Hospital Registration Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Review incoming hospital registrations and approve or request changes.</p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              className="outline-none text-sm w-64"
              placeholder="Search by name, email, reg. number or address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${statusFilter === "pending" ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("accepted")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${statusFilter === "accepted" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Accepted
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${statusFilter === "rejected" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Rejected
            </button>
          </div>
        </div>
      </header>

      <main>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={24} className="animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-700 rounded-lg">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 bg-gray-50 rounded-lg text-gray-600">No matching requests.</div>
        ) : (
          <HospitalTable
            data={filtered}
            onRowClick={openDetails}
            onActionClick={(action, item) => openConfirm(action, item)}
          />
        )}
      </main>

      <HospitalDetailsDrawer
        open={!!selected}
        item={selected}
        onClose={closeDetails}
        onAction={(action, item, note) => openConfirm(action, { ...item, note })}
      />

      <ConfirmationModal
        open={modal.open}
        title={
          modal.action === "accepted"
            ? "Confirm Accept"
            : modal.action === "rejected"
              ? "Confirm Reject"
              : "Request Changes"
        }
        description={
          modal.action === "accepted"
            ? "Are you sure you want to accept this hospital registration? This will publish it on the portal."
            : modal.action === "rejected"
              ? "Are you sure you want to reject this registration request?"
              : "Please provide requested changes for the hospital to update. They will receive your message."
        }
        onClose={closeConfirm}
        onConfirm={(payload) => handleUpdateStatus(modal.action, payload)}
        requireNote={modal.action === "changes_requested"}
        payload={modal.payload}
        loading={actionLoading}
      />
    </div>
  );
}