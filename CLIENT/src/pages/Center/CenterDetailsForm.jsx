import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { auth } from "../../firebase";
import LocationDetailsForm from "../../components/loginSignup/LocationDetailsForm";
import ComplianceForm from "../../components/loginSignup/ComplianceForm";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function CenterDetailsForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    dialysisCount: "",
    normalCost: "",
    emergencyAvailable: false,
    emergencyCost: "",
    workingDays: [],
    openingTime: "",
    closingTime: "",
    emergency24x7: false,
    rating: 0,
    upiId: "",
  });

  /* ---------- HANDLERS ---------- */

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

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 1️⃣ Firebase token
      const token = await auth.currentUser.getIdToken();

      // 2️⃣ Create center user in backend
      const res = await api.post(
        "/api/users/login", // ✅ CORRECT API
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

      const user = res.data.user; // ✅ MongoDB center user

      // 3️⃣ Redirect to REAL center dashboard
      navigate(`/center/${user._id}/dashboard`, { replace: true });

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Something went wrong while registering center"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-64">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 mt-6 bg-white p-6 rounded-xl shadow"
      >
        <h3 className="font-semibold text-lg text-gray-800">
          Dialysis Center Details
        </h3>

        {/* BASIC DETAILS */}
        <input
          type="email"
          name="email"
          placeholder="Contact Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-200 rounded-xl"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Contact Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-200 rounded-xl"
          required
        />

        <input
          type="number"
          name="dialysisCount"
          placeholder="Number of Dialysis Machines"
          value={formData.dialysisCount}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-200 rounded-xl"
        />

        <input
          type="number"
          name="normalCost"
          placeholder="Cost per Session"
          value={formData.normalCost}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-200 rounded-xl"
        />

        {/* EMERGENCY DIALYSIS */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="emergencyAvailable"
            checked={formData.emergencyAvailable}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <span className="text-sm font-medium">
            Emergency Dialysis Available
          </span>
        </div>

        {formData.emergencyAvailable && (
          <input
            type="number"
            name="emergencyCost"
            placeholder="Emergency Cost per Session"
            value={formData.emergencyCost}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-200 rounded-xl"
          />
        )}

        {/* 24/7 EMERGENCY */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">
            24/7 Emergency Dialysis
          </h4>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, emergency24x7: true }))
              }
              className={`px-5 py-2 rounded-full font-medium transition
                ${
                  formData.emergency24x7
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Yes
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, emergency24x7: false }))
              }
              className={`px-5 py-2 rounded-full font-medium transition
                ${
                  !formData.emergency24x7
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              No
            </button>
          </div>
        </div>

        {/* RATING */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">
            Center Rating
          </h4>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, rating: star }))
                }
                className={`w-10 h-10 rounded-full text-lg font-bold transition
                  ${
                    formData.rating >= star
                      ? "bg-teal-600 text-white scale-105"
                      : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* WORKING DAYS */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">
            Working Days
          </h4>

          <div className="flex flex-wrap gap-3">
            {daysOfWeek.map((day) => {
              const isSelected = formData.workingDays.includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      isSelected
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* LOCATION + COMPLIANCE */}
        <LocationDetailsForm />
        <ComplianceForm />

        {/* UPI */}
        <input
          type="text"
          name="upiId"
          placeholder="UPI ID / Payment Link"
          value={formData.upiId}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-200 rounded-xl"
        />

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-3 rounded-xl font-medium disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
