import { auth } from "../../firebase";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LocationDetailsForm from "../../components/loginSignup/LocationDetailsForm";

export default function PatientDetailsForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    dialysisType: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1️⃣ Get Firebase token
      const token = await auth.currentUser.getIdToken();

      // 2️⃣ Create patient in backend (MongoDB)
      const res = await api.post(
        "/api/users/login", // ✅ CORRECT API
        {
          role: "patient",
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = res.data.user; // ✅ MongoDB user

      // 3️⃣ Redirect to REAL dashboard
      navigate(`/patient/${user._id}/dashboard`, { replace: true });

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Something went wrong while registering"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow space-y-5">
      <h3 className="font-semibold text-xl text-gray-800">
        Patient Details
      </h3>

      {/* BASIC INFO */}
      <div className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
        />

        <input
          name="phone"
          placeholder="Mobile Number"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="age"
            placeholder="Age"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
          />

          <input
            name="weight"
            placeholder="Weight"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
          />

          <select
            name="gender"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <select
            name="dialysisType"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Dialysis Type</option>
            <option>Hemodialysis</option>
            <option>Peritoneal Dialysis</option>
          </select>
        </div>

        <input
          name="bloodGroup"
          placeholder="Blood Group"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* EMERGENCY CONTACT */}
      <div className="pt-4 border-t space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">
          Emergency Contact
        </h4>

        <input
          name="emergencyName"
          placeholder="Contact Person Name"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="emergencyRelation"
            placeholder="Relation"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
          />

          <input
            name="emergencyPhone"
            placeholder="Contact Number"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <LocationDetailsForm />
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-4 py-3 rounded-full bg-teal-600 text-white font-semibold hover:bg-teal-700 transition disabled:opacity-60"
      >
        {loading ? "Registering..." : "Complete Registration"}
      </button>
    </div>
  );
}
