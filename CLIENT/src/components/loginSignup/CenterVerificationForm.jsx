import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { auth } from "../../firebase";

export default function CenterDetailsForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    centerName: "",
    registrationNumber: "",
    centerType: "Government",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await auth.currentUser.getIdToken();

      await api.post(
        "/api/auth/login",
        {
          role: "center",
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Move to next center details step
      navigate("/center/details", { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to save center details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100 flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 space-y-8">

        {/* HEADER */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Dialysis Center Identity
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Provide official details to verify your center
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-5">
          <input
            name="centerName"
            placeholder="Hospital / Center Name"
            value={formData.centerName}
            onChange={handleChange}
            className="input"
          />

          <input
            name="registrationNumber"
            placeholder="Registration Number"
            value={formData.registrationNumber}
            onChange={handleChange}
            className="input"
          />

          <select
            name="centerType"
            value={formData.centerType}
            onChange={handleChange}
            className="input"
          >
            <option>Government</option>
            <option>Private</option>
            <option>Trust</option>
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold text-lg hover:opacity-95 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Verify Authenticity"}
        </button>
      </div>

      {/* Utility styles */}
      <style>{`
        .input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          background: #f1f5f9;
          color: #334155;
          outline: none;
          border: 1px solid transparent;
        }
        .input:focus {
          border-color: #14b8a6;
          background: white;
        }
      `}</style>
    </div>
  );
}
