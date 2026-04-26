import React, { useEffect, useState } from "react";
import { Search, Loader, LogOut } from "lucide-react";
import HospitalTable from "../../components/adminPage/HospitalTable";
import HospitalDetailsDrawer from "../../components/adminPage/HospitalDetailsDrawer";
import ConfirmationModal from "../../components/adminPage/ConfirmationModal";
import api, { setAuthToken } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminHospitalsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState({ open: false, action: null, payload: null });
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          sessionStorage.getItem("token") ||
          localStorage.getItem("token");

        if (token) {
          setAuthToken(token);
        } else {
          setAuthToken(null);
          navigate("/login", { replace: true });
          return;
        }

        const res = await api.get("/api/admin/requests");
        setRequests(res.data.data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
          setAuthToken(null);
          navigate("/login", { replace: true });
        } else if (err.response?.status === 403) {
          setError("Access denied. Admin only.");
        } else {
          setError("Failed to load requests");
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  onConfirm={async (payload) => {
  try {
    setActionLoading(true);

    await api.patch(`/api/admin/requests/${payload._id}/status`, {
      status: modal.action,
      note: payload.note || "",
    });

    // update UI (remove or update status)
    setRequests((prev) =>
      prev.map((r) =>
        r._id === payload._id
          ? { ...r, status: modal.action }
          : r
      )
    );

    setModal({ open: false, action: null, payload: null });

  } catch (err) {
    console.error("Action failed:", err);
    alert(err.response?.data?.error || "Action failed");
  } finally {
    setActionLoading(false);
  }
}}

  const filtered = requests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      r.hospitalName?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.address?.toLowerCase().includes(q) ||
      r.registrationNumber?.toLowerCase().includes(q)
    );
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
      setAuthToken(null);
      navigate("/login", { replace: true });
    }
  };

  const bfsStyleScroll = "overflow-x-auto scrollbar-hide";

  return (
    <div className="px-4 py-4 sm:px-6 min-h-screen bg-slate-200">
      
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">

        {/* TITLE */}
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Hospital Registration Requests
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review incoming hospital registrations and approve or request changes.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

          {/* SEARCH */}
          <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm w-full sm:w-auto">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              className="outline-none text-sm w-full sm:w-64"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* FILTERS */}
          <div className="flex gap-2 overflow-x-auto sm:overflow-visible scrollbar-hide">
            {["all", "accepted", "rejected", "pending"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-lg font-medium whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-slate-800 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
            {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm w-full sm:w-auto"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
          </div>
          
        </div>
      </header>

      {/* MAIN */}
      <main>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={24} className="animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="p-4 sm:p-6 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4 sm:p-8 bg-gray-50 rounded-lg text-gray-600 text-sm sm:text-base">
            No matching requests.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <HospitalTable
              data={filtered}
              onRowClick={(item) => setSelected(item)}
              onActionClick={(action, item) =>
                setModal({ open: true, action, payload: item })
              }
              actionsDisabled={actionLoading}
            />
          </div>
        )}
      </main>

      {/* DRAWER */}
      <HospitalDetailsDrawer
        open={!!selected}
        item={selected}
        onClose={() => setSelected(null)}
        onAction={(action, item, note) =>
          setModal({ open: true, action, payload: { ...item, note } })
        }
        actionsDisabled={actionLoading}
      />

      {/* MODAL */}
      <ConfirmationModal
        open={modal.open}
        title={
          modal.action === "accepted"
            ? "Confirm Accept"
            : modal.action === "rejected"
            ? "Confirm Reject"
            : "Request Changes"
        }
        description="Please confirm your action."
        onClose={() => setModal({ open: false })}
        onConfirm={(payload) => {
          // your existing handler
        }}
        requireNote={modal.action === "changes_requested"}
        payload={modal.payload}
        loading={actionLoading}
      />
    </div>
  );
}