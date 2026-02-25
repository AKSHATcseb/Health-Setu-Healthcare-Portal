import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { auth } from "../../firebase";
import LocationDetailsForm from "./LocationDetailsForm";
import ComplianceForm from "./ComplianceForm";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export default function CenterDetailsForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ SAME UI FORM STATE (Only corrected names)
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
    workingHours: {
      open: "",
      close: "",
    },

    upiId: "",

    address: null,
    location: null,
  });

  /* ---------------- HANDLERS ---------------- */

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

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;

      if (!user) {
        setError("User not logged in.");
        return;
      }

      // ✅ Refresh verification status
      await user.reload();

      if (!user.emailVerified) {
        setError("Please verify your email before registering center.");
        return;
      }

      // ✅ Location required
      if (!formData.location) {
        setError("Please select your current GPS location.");
        return;
      }

      const token = await user.getIdToken(true);

      // ✅ FINAL Correct Payload for Hospital Schema
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

        // ✅ LocationDetailsForm provides both
        address: formData.address,
        location: formData.location,
      };

      console.log("✅ Sending Hospital Payload:", payload);

      // ✅ Correct API Endpoint
      const res = await api.post(
        "/api/hospitals",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Center Registered Successfully!");

      navigate(`/center/dashboard`, { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || "Center registration failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI (UNCHANGED) ---------------- */

  return (
    <div className="min-h-screen bg-teal-100 px-4 py-10 flex justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-10 space-y-12"
      >

        {/* HEADER */}
        <div className="border-b pb-6">
          <h2 className="text-3xl font-bold text-slate-800">
            Dialysis Center Registration
          </h2>
          <p className="text-slate-500 mt-2">
            Complete your center profile to get verified and listed for patients
          </p>
        </div>

        {/* BASIC INFO */}
        <section className="space-y-6">

          <h3 className="text-xl font-semibold text-teal-700">
            Basic Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <input name="name" placeholder="Center Name" onChange={handleChange} className="input" />

            <input name="registrationNumber" placeholder="Registration Number" onChange={handleChange} className="input" />

            <select name="type" onChange={handleChange} className="input">
              <option value="">Hospital Type</option>
              <option value="private">Private</option>
              <option value="government">Government</option>
              <option value="trust">Trust</option>
            </select>

            <input name="email" placeholder="Contact Email" onChange={handleChange} className="input" />

            <input name="phone" placeholder="Contact Phone" onChange={handleChange} className="input" />

            <input name="totalMachines" placeholder="Total Dialysis Machines" onChange={handleChange} className="input" />

            <input name="costPerSession4h" placeholder="Cost per 4 hour session" onChange={handleChange} className="input" />

            <input name="costPerSession6h" placeholder="Cost per 6 hour session" onChange={handleChange} className="input" />

          </div>
        </section>

        {/* EMERGENCY */}
        <section className="space-y-5">

          <h3 className="text-xl font-semibold text-teal-700">
            Emergency Services
          </h3>

          <label className="flex items-center gap-3 text-slate-700">
            <input type="checkbox" name="emergencyServices" onChange={handleChange} />
            Emergency dialysis available
          </label>

          {formData.emergencyServices && (
            <input
              name="emergencyCostPerSession"
              placeholder="Emergency cost per session"
              onChange={handleChange}
              className="input"
            />
          )}

        </section>

        {/* WORKING TIME */}
        <section className="space-y-5">

          <h3 className="text-xl font-semibold text-teal-700">
            Operating Schedule
          </h3>

          <label className="flex items-center gap-3 text-slate-700">
            <input type="checkbox" name="is24x7" onChange={handleChange} />
            Open 24/7
          </label>

          {!formData.is24x7 && (
            <div className="space-y-5">

              <div className="flex flex-wrap gap-3">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-full border transition ${formData.workingDays.includes(day)
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">

                <input
                  type="time"
                  className="input"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      workingHours: {
                        ...prev.workingHours,
                        open: e.target.value,
                      },
                    }))
                  }
                />

                <input
                  type="time"
                  className="input"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      workingHours: {
                        ...prev.workingHours,
                        close: e.target.value,
                      },
                    }))
                  }
                />

              </div>
            </div>
          )}
        </section>

        {/* LOCATION */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-700">
            Location Details
          </h3>

          <LocationDetailsForm
            onChange={(payload) =>
              setFormData((prev) => ({
                ...prev,
                address: payload.address,
                location: payload.location,
              }))
            }
          />
        </section>

        {/* COMPLIANCE */}
        {/* <section className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-700">
            Compliance & Verification
          </h3>

          <ComplianceForm />
        </section> */}

        {/* PAYMENT */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-700">
            Payment Information
          </h3>

          <input
            name="upiId"
            placeholder="UPI ID or Payment Link"
            onChange={handleChange}
            className="input"
          />
        </section>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-teal-600 hover:bg-teal-700 
                   text-white font-semibold text-lg transition disabled:opacity-60"
        >
          {loading ? "Saving Center Profile..." : "Complete Registration"}
        </button>

      </form>

      {/* UTILITY STYLES (unchanged behaviour) */}
      <style>{`
      .input {
        width: 100%;
        padding: 14px 16px;
        border-radius: 14px;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        outline: none;
      }

      .input:focus {
        border-color: #14b8a6;
        background: white;
      }
    `}</style>

    </div>
  );
}
