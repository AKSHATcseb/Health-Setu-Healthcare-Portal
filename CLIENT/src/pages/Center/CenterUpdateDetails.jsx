import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { auth } from "../../firebase";
import LocationDetailsForm from "../../components/loginSignup/LocationDetailsForm";
import { getMyHospital } from "../../services/hospitalApi";

const daysOfWeek = [
  "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
];

export default function CenterUpdateDetails() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hospitalId, setHospitalId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    type: "",

    email: "",
    phone: "",

    totalMachines: "",
    costPerSession4h: "",
    costPerSession6h: "",

    emergencyServices: false,
    emergencyCostPerSession: "",

    is24x7: false,
    workingDays: [],
    workingHours: { open: "", close: "" },

    upiId: "",

    address: null,
    location: null,
  });

  /* ================= FETCH EXISTING DATA ================= */

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await getMyHospital();
        const h = res.data;

        setHospitalId(h._id);

        setFormData({
          name: h.name || "",
          registrationNumber: h.registrationNumber || "",
          type: h.type || "",

          email: h.email || "",
          phone: h.phone || "",

          totalMachines: h.totalMachines || "",
          costPerSession4h: h.costPerSession4h || "",
          costPerSession6h: h.costPerSession6h || "",

          emergencyServices: h.emergencyServices || false,
          emergencyCostPerSession: h.emergencyCostPerSession || "",

          is24x7: h.is24x7 || false,
          workingDays: h.workingDays || [],
          workingHours: h.workingHours || { open: "", close: "" },

          upiId: h.upiId || "",

          address: h.address || null,
          location: h.location || null,
        });

      } catch (err) {
        console.error("Failed to load hospital data", err);
      }
    };

    fetchHospital();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  /* ================= SUBMIT UPDATE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        setError("User not logged in");
        return;
      }

      const token = await user.getIdToken(true);

      const payload = {
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        type: formData.type,

        phone: formData.phone,
        email: formData.email,

        totalMachines: Number(formData.totalMachines),
        availableMachines: Number(formData.totalMachines),

        costPerSession4h: Number(formData.costPerSession4h),
        costPerSession6h: Number(formData.costPerSession6h),

        emergencyServices: formData.emergencyServices,
        emergencyCostPerSession: formData.emergencyServices
          ? Number(formData.emergencyCostPerSession)
          : null,

        is24x7: formData.is24x7,

        workingDays: formData.is24x7 ? [] : formData.workingDays,

        workingHours: formData.is24x7
          ? { open: "00:00", close: "23:59" }
          : formData.workingHours,

        upiId: formData.upiId,

        address: formData.address,
        location: formData.location,
      };

      await api.put(
        `/api/hospitals/${hospitalId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Details Updated Successfully!");

      navigate("/center/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-teal-100 px-4 py-10 flex justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-10 space-y-12"
      >

        <h2 className="text-3xl font-bold text-slate-800 border-b pb-6">
          Update Dialysis Center Details
        </h2>

        {/* BASIC INFO */}
        <div className="grid md:grid-cols-2 gap-6">

          <input name="name" value={formData.name} onChange={handleChange} className="input" placeholder="Center Name"/>

          <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="input" placeholder="Registration Number"/>

          <select name="type" value={formData.type} onChange={handleChange} className="input">
            <option value="">Hospital Type</option>
            <option value="private">Private</option>
            <option value="government">Government</option>
            <option value="trust">Trust</option>
          </select>

          <input name="email" value={formData.email} onChange={handleChange} className="input" placeholder="Email"/>

          <input name="phone" value={formData.phone} onChange={handleChange} className="input" placeholder="Phone"/>

          <input name="totalMachines" value={formData.totalMachines} onChange={handleChange} className="input" placeholder="Total Machines"/>

          <input name="costPerSession4h" value={formData.costPerSession4h} onChange={handleChange} className="input" placeholder="Cost 4 Hours"/>

          <input name="costPerSession6h" value={formData.costPerSession6h} onChange={handleChange} className="input" placeholder="Cost 6 Hours"/>

        </div>

        {/* EMERGENCY */}

        <label className="flex gap-3">
          <input type="checkbox" name="emergencyServices" checked={formData.emergencyServices} onChange={handleChange}/>
          Emergency Available
        </label>

        {formData.emergencyServices && (
          <input
            name="emergencyCostPerSession"
            value={formData.emergencyCostPerSession}
            onChange={handleChange}
            className="input"
            placeholder="Emergency Cost"
          />
        )}

        {/* WORKING DAYS */}

        {!formData.is24x7 && (
          <div className="flex flex-wrap gap-3">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-full border ${
                  formData.workingDays.includes(day)
                    ? "bg-teal-600 text-white"
                    : "bg-white"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}

        {/* LOCATION */}

        <LocationDetailsForm
          onChange={(payload) =>
            setFormData((prev) => ({
              ...prev,
              address: payload.address,
              location: payload.location,
            }))
          }
        />

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700"
        >
          {loading ? "Updating..." : "Update Details"}
        </button>

      </form>

      <style>{`
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }
      `}</style>

    </div>
  );
}
