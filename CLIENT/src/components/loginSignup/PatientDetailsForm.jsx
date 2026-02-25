import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { auth } from "../../firebase";
import LocationDetailsForm from "./LocationDetailsForm";

export default function PatientDetailsForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Only profile fields (name already saved in /auth/login)
  const [formData, setFormData] = useState({
    phone: "",
    age: "",
    weight: "",
    gender: "",
    dialysisType: "",
    bloodGroup: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    address: null,
    location: null,
  });

  // ✅ Handle Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

    await user.reload();

    if (!user.emailVerified) {
      setError("Please verify your email before updating profile.");
      return;
    }

    if (!formData.location) {
      setError("Please select your current GPS location.");
      return;
    }

    const token = await user.getIdToken(true);

    const payload = {
      phone: formData.phone,
      age: Number(formData.age),
      weight: Number(formData.weight),
      gender: formData.gender,

      address: formData.address,
      location: formData.location,

      medicalInfo: {
        bloodGroup: formData.bloodGroup,
        dialysisType: formData.dialysisType,
      },

      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relation: formData.emergencyRelation,
      },
    };

    console.log("✅ Sending Patient Payload:", payload);

    await api.put(
      "/api/users/me",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("✅ Profile Updated Successfully!");
    navigate(`/patient/dashboard`, { replace: true });

  } catch (err) {
    setError(err.response?.data?.message || "Profile update failed.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 flex justify-center">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-10 space-y-12">

        {/* HEADER */}
        <div className="border-b pb-6">
          <h2 className="text-3xl font-bold text-slate-800">
            Patient Profile Setup
          </h2>
          <p className="text-slate-500 mt-2">
            Complete your medical profile for personalized care and faster bookings
          </p>
        </div>

        {/* PERSONAL INFO */}
        <section className="space-y-6">

          <h3 className="text-xl font-semibold text-teal-700">
            Personal & Medical Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <input name="phone" placeholder="Mobile Number" value={formData.phone} onChange={handleChange} className="input" />

            <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} className="input" />

            <input name="weight" type="number" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} className="input" />

            <select name="gender" value={formData.gender} onChange={handleChange} className="input">
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <select name="dialysisType" value={formData.dialysisType} onChange={handleChange} className="input">
              <option value="">Dialysis Type</option>
              <option value="hemodialysis">Hemodialysis</option>
              <option value="peritoneal">Peritoneal Dialysis</option>
            </select>

            <input name="bloodGroup" placeholder="Blood Group (e.g. B+)" value={formData.bloodGroup} onChange={handleChange} className="input" />

          </div>
        </section>

        {/* EMERGENCY */}
        <section className="space-y-6 pt-8 border-t">

          <h3 className="text-xl font-semibold text-red-600">
            Emergency Contact
          </h3>

          <input
            name="emergencyName"
            placeholder="Emergency Contact Name"
            value={formData.emergencyName}
            onChange={handleChange}
            className="input"
          />

          <div className="grid md:grid-cols-2 gap-6">

            <input
              name="emergencyRelation"
              placeholder="Relation"
              value={formData.emergencyRelation}
              onChange={handleChange}
              className="input"
            />

            <input
              name="emergencyPhone"
              placeholder="Emergency Phone Number"
              value={formData.emergencyPhone}
              onChange={handleChange}
              className="input"
            />

          </div>
        </section>

        {/* LOCATION */}
        {/* <section className="space-y-4 pt-8 border-t">

          <h3 className="text-xl font-semibold text-slate-700">
            Location Details
          </h3>

          <LocationDetailsForm
            onChange={(location) =>
              setFormData((prev) => ({ ...prev, location }))
            }
          />
        </section> */}

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

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-teal-600 hover:bg-teal-700
                   text-white font-semibold text-lg transition disabled:opacity-60"
        >
          {loading ? "Saving Profile..." : "Complete Registration"}
        </button>

      </div>

      {/* INPUT STYLES */}
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
