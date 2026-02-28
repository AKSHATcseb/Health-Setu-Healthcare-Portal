import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/patientDetailsForm/ProfileHeader";
import ProgressIndicator from "../../components/patientDetailsForm/ProgressIndicator";
import PersonalDetailsForm from "../../components/patientDetailsForm/PersonalDetailsForm";
import MedicalDetailsForm from "../../components/patientDetailsForm/MedicalDetailsForm";
import LocationDetailsForm from "../../components/patientDetailsForm/LocationDetailsForm";
import FormActions from "../../components/patientDetailsForm/FormActions";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isLoading, setIsLoading] = useState(false);

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

  // Validation functions
  const isStep1Valid = () => {
    return (
      formData.fullName &&
      formData.mobileNumber &&
      formData.email &&
      !errors.fullName &&
      !errors.mobileNumber &&
      !errors.email
    );
  };

  const isStep2Valid = () => {
    return formData.age && formData.gender && formData.bloodGroup && !errors.age;
  };

  const isStep3Valid = () => {
    return formData.address && !errors.address;
  };

  const isCurrentStepValid = () => {
    if (currentStep === 1) return isStep1Valid();
    if (currentStep === 2) return isStep2Valid();
    if (currentStep === 3) return isStep3Valid();
    return false;
  };

  const handleNext = async () => {
    if (!isCurrentStepValid()) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Submit form
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Profile data submitted:", formData);

      // Navigate to success page or appointments page
      navigate("/profile-success");
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Error completing profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <ProfileHeader />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

          {/* Forms */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <PersonalDetailsForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
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
          <div className="hidden lg:block mt-8 bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md">
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
          </div>
        </div>
      </div>
    </div>
  );
}