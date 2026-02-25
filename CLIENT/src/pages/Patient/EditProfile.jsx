import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { auth } from "../../firebase";
import LocationDetailsForm from "../../components/loginSignup/LocationDetailsForm";

export default function EditProfile() {
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

      // ✅ FINAL Correct Payload for patient Schema
      const payload = {
        phone: formData.phone,
        age: formData.age,
        weight: formData.weight,
        gender: formData.gender,
        dialysisType: formData.dialysisType,
        bloodGroup: formData.bloodGroup,
        emergencyName: formData.emergencyName,
        emergencyRelation: formData.emergencyRelation,
        emergencyPhone: formData.emergencyPhone,

        // ✅ LocationDetailsForm provides both
        address: formData.address,
        location: formData.location,
      };

      console.log("✅ Sending Patient Payload:", payload);

      // ✅ Correct API Endpoint
      const res = await api.put(
        "/api/users/me",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ patient Registered Successfully!");

      navigate(`/patient/dashboard`, { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || "patient registration failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(
          "/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${await auth.currentUser.getIdToken()}`
            }
          }
        );

        const u = res.data;

        setFormData({
          phone: u.phone || "",
          age: u.age || "",
          weight: u.weight || "",
          gender: u.gender || "",
          dialysisType: u.medicalInfo?.dialysisType || "",
          bloodGroup: u.medicalInfo?.bloodGroup || "",
          emergencyName: u.emergencyContact?.name || "",
          emergencyRelation: u.emergencyContact?.relation || "",
          emergencyPhone: u.emergencyContact?.phone || "",
          address: u.address || null,
          location: u.location || null,
        });

      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    loadProfile();
  }, []);


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

          <LocationDetailsForm
            value={{
              address: formData.address,
              location: formData.location,
            }}
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
          {loading ? "Saving Profile..." : "Save Changes"}
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
