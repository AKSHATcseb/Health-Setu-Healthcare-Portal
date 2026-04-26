import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/patientDetailsForm/ProfileHeader";
import PersonalDetailsForm from "../../components/patientDetailsForm/PersonalDetailsForm";
import MedicalDetailsForm from "../../components/patientDetailsForm/MedicalDetailsForm";
import LocationDetailsForm from "../../components/patientDetailsForm/LocationDetailsForm";
import FormActions from "../../components/patientDetailsForm/FormActions";
import api, { setAuthToken } from "../../services/api";

/**
 * CompleteProfile
 *
 * - Prefills data by calling GET /api/patient/details (requires Authorization header).
 * - Submits profile to POST /api/patient/details.
 * - Backend will mark profileCompleted = true on save. After successful save,
 *   we redirect user to /patient/dashboard/:id using the returned patient._id.
 *
 * Note: This component expects the child form components to:
 * - accept formData and setFormData props (they already do in your snippet),
 * - not perform API calls themselves.
 */

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    mobileNumber: "",
    email: "",
    // Medical Details
    age: "",
    gender: "",
    bloodGroup: "",
    // Location Details
    address: "",
    latitude: null,
    longitude: null,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    age: "",
    address: "",
  });

  // Load prefill / existing patient on mount
  useEffect(() => {
    const fetchPrefill = async () => {
      setIsLoading(true);
      setGlobalError("");
      try {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (token) setAuthToken(token);
        else setAuthToken(null);

        const res = await api.get("/api/patient/details");
        // res.data: { prefill: { fullName, email }, patient: {...} }
        const prefill = res.data?.prefill ?? {};
        const patient = res.data?.patient ?? null;

        setFormData((prev) => ({
          ...prev,
          fullName: patient?.fullName ?? prefill.fullName ?? prev.fullName,
          email: prefill.email ?? patient?.email ?? prev.email,
          mobileNumber: patient?.mobileNumber ?? prev.mobileNumber,
          age: patient?.age ?? prev.age,
          gender: patient?.gender ?? prev.gender,
          bloodGroup: patient?.bloodGroup ?? prev.bloodGroup,
          address: patient?.address ?? prev.address,
          latitude: patient?.latitude ?? prev.latitude,
          longitude: patient?.longitude ?? prev.longitude,
        }));

        // If patient exists and profileCompleted === true, redirect to dashboard
        if (patient && patient.profileCompleted === true) {
          const pid = patient._id || patient.id;
          if (pid) {
            navigate(`/patient/dashboard/${pid}`, { replace: true });
            return;
          }
        }

        // If patient exists and incomplete, keep them on form with prefilled fields
      } catch (err) {
        console.error("Failed to fetch patient prefill:", err);
        // If 404, no prefill -> continue with empty form. Show only non-fatal message.
        if (err.response && err.response.status !== 404) {
          setGlobalError(
            err.response?.data?.message ||
              "Unable to fetch existing profile. Please try again."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validation functions
  const isStep1Valid = () => {
    const ok =
      formData.fullName?.trim() &&
      formData.mobileNumber?.trim() &&
      formData.email?.trim() &&
      !errors.fullName &&
      !errors.mobileNumber &&
      !errors.email;
    return Boolean(ok);
  };

  const isStep2Valid = () => {
    const ok = formData.age && formData.gender && formData.bloodGroup && !errors.age;
    return Boolean(ok);
  };

  const isStep3Valid = () => {
  const hasLocation =
    formData.latitude !== null &&
    formData.longitude !== null;

  const ok =
    formData.address &&
    !errors.address &&
    hasLocation;

  return Boolean(ok);
};

  const isCurrentStepValid = () => {
    if (currentStep === 1) return isStep1Valid();
    if (currentStep === 2) return isStep2Valid();
    if (currentStep === 3) return isStep3Valid();
    return false;
  };

  const handleNext = async () => {
    setGlobalError("");
    // Validate current step before moving
    if (!isCurrentStepValid()) {
      setGlobalError("Please fix validation errors before continuing.");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // final submit
      await handleSubmit();
    }
  };

  const handleBack = () => {
    setGlobalError("");
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setGlobalError("");
    setIsLoading(true);

    try {
      // Ensure auth header set
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      if (token) setAuthToken(token);
      else setAuthToken(null);

      // Build payload expected by backend.
      const payload = {
        // fullName is optional (backend will accept it), email is NOT sent (backend takes canonical email).
        fullName: formData.fullName?.trim() || undefined,
        mobileNumber: String(formData.mobileNumber).trim(),
        age: Number(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: String(formData.address).trim(),
        latitude: formData.latitude ?? null,
        longitude: formData.longitude ?? null,
        // do not explicitly set profileCompleted unless you want to override backend default
      };

      const res = await api.post("/api/patient/details", payload);

      // Expect response: { message, user: { id, email }, patient }
      const savedPatient = res.data?.patient;
      if (!savedPatient) {
        setGlobalError("Saved but server did not return patient id. Please try again.");
        return;
      }

      const pid = savedPatient._id || savedPatient.id;
      if (!pid) {
        setGlobalError("Saved but no patient id returned. Please contact support.");
        return;
      }

      // Redirect to dashboard for the saved patient
      // navigate(`/patient/dashboard/${pid}`, { replace: true });
      navigate(`/login`, { replace: true });
    } catch (err) {
      console.error("Error saving profile:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Unable to save profile. Please try again.";
      setGlobalError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200">
      <ProfileHeader />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Progress Indicator */}
          {/* <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} /> */}

          {/* Global Error */}
          {globalError && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-100">
              {globalError}
            </div>
          )}

          {/* Loading indicator (initial prefill) */}
          {isLoading && (
            <div className="mb-4 p-3 rounded bg-yellow-50 text-yellow-700 border border-yellow-100">
              Processing...
            </div>
          )}

          {/* Forms */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <PersonalDetailsForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                // If your PersonalDetailsForm expects props to disable editing email:
                readOnlyEmail={true}
              />
            )}

            {currentStep === 2 && (
              <MedicalDetailsForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
              />
            )}

            {currentStep === 3 && (
              <LocationDetailsForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
              />
            )}

            {/* Form Actions */}
            <FormActions
              onBack={handleBack}
              onSubmit={handleNext}
              isLoading={isLoading}
              isFormValid={isCurrentStepValid()}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </div>

          {/* Form Summary (Desktop) */}
          {/* <div className="hidden lg:block mt-8 bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Profile Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {formData.fullName && (
                <div>
                  <p className="text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-900">{formData.fullName}</p>
                </div>
              )}
              {formData.mobileNumber && (
                <div>
                  <p className="text-gray-600">Mobile</p>
                  <p className="font-semibold text-gray-900">{formData.mobileNumber}</p>
                </div>
              )}
              {formData.age && (
                <div>
                  <p className="text-gray-600">Age</p>
                  <p className="font-semibold text-gray-900">{formData.age} years</p>
                </div>
              )}
              {formData.bloodGroup && (
                <div>
                  <p className="text-gray-600">Blood Group</p>
                  <p className="font-semibold text-gray-900">{formData.bloodGroup}</p>
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}