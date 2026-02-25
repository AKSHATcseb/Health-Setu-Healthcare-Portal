import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { auth } from "../../firebase";

export default function CenterDetailsForm() {
  const navigate = useNavigate();

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
      const token = await auth.currentUser.getIdToken();

      // send basic center identity to backend
      await api.post(
        "/api/users/login",
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

      // move to verification step
      navigate("/center/verify");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to save center details"
      );
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <h3 className="font-semibold text-lg text-gray-800">
        Dialysis Center Details
      </h3>

      {/* BASIC IDENTITY */}
      <input
        type="text"
        name="centerName"
        placeholder="Hospital / Center Name"
        value={formData.centerName}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-200 text-gray-600 rounded-xl"
      />

      <input
        type="text"
        name="registrationNumber"
        placeholder="Registration Number"
        value={formData.registrationNumber}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-200 text-gray-600 rounded-xl"
      />

      <select
        name="centerType"
        value={formData.centerType}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-200 text-gray-600 rounded-xl"
      >
        <option>Government</option>
        <option>Private</option>
        <option>Trust</option>
      </select>

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-full bg-teal-600 text-white font-semibold"
      >
        Verify Authenticity
      </button>
    </div>
  );
}
