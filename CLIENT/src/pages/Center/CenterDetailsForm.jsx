import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HospitalHeader from "../../components/centerDetailsForm/HospitalHeader";
import HospitalProgressIndicator from "../../components/centerDetailsForm/HospitalProgessIndicator";
import BasicHospitalInfoForm from "../../components/centerDetailsForm/BasicHospitalInfoForm";
import OperatingHoursForm from "../../components/centerDetailsForm/OperatingHoursForm";
import DialysisDetailsForm from "../../components/centerDetailsForm/DialysisDetailsForm";
import HospitalLocationForm from "../../components/centerDetailsForm/HospitalLocationForm";
import AdditionalFacilitiesForm from "../../components/centerDetailsForm/AdditionalFacilitiesForm";
import BankDetailsForm from "../../components/centerDetailsForm/BankDetailsForm";
import HospitalFormActions from "../../components/centerDetailsForm/HospitalFormActions";

export default function CenterDetailsForm({ isEditMode = false }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info
    hospitalName: "",
    email: "",
    phone: "",
    website: "",
    // Operating Hours
    is24x7: false,
    operatingHours: {},
    // Dialysis Details
    dialysisSeats: "",
    dialysisType: "",
    emergencyServices: false,
    homeCollection: false,
    labTests: false,
    // Location
    address: "",
    latitude: null,
    longitude: null,
    // Additional Facilities
    facilities: [],
    // Bank Details
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const [errors, setErrors] = useState({
    hospitalName: "",
    email: "",
    phone: "",
    website: "",
    dialysisSeats: "",
    address: "",
    accountNumber: "",
    ifscCode: "",
  });

  // Validation functions
  const isStep1Valid = () => {
    return (
      formData.hospitalName &&
      formData.email &&
      formData.phone &&
      !errors.hospitalName &&
      !errors.email &&
      !errors.phone
    );
  };

  const isStep2Valid = () => {
    return formData.is24x7 || Object.keys(formData.operatingHours).length > 0;
  };

  const isStep3Valid = () => {
    return (
      formData.dialysisSeats &&
      formData.dialysisType &&
      !errors.dialysisSeats
    );
  };

  const isStep4Valid = () => {
    return formData.address && !errors.address;
  };

  const isStep5Valid = () => {
    return (
      formData.accountHolderName &&
      formData.bankName &&
      formData.accountNumber &&
      formData.ifscCode &&
      !errors.accountNumber &&
      !errors.ifscCode
    );
  };

  const isCurrentStepValid = () => {
    if (currentStep === 1) return isStep1Valid();
    if (currentStep === 2) return isStep2Valid();
    if (currentStep === 3) return isStep3Valid();
    if (currentStep === 4) return isStep4Valid();
    if (currentStep === 5) return isStep5Valid();
    return false;
  };

  const handleNext = async () => {
    if (!isCurrentStepValid()) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Hospital data submitted:", formData);
      navigate("/hospital-success");
    } catch (error) {
      console.error("Error submitting hospital registration:", error);
      alert("Error completing registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <HospitalHeader isEditMode={isEditMode} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <HospitalProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
          />

          {/* Forms */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <BasicHospitalInfoForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
              />
            )}

            {currentStep === 2 && (
              <OperatingHoursForm formData={formData} setFormData={setFormData} />
            )}

            {currentStep === 3 && (
              <DialysisDetailsForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
              />
            )}

            {currentStep === 4 && (
              <>
                <HospitalLocationForm
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  setErrors={setErrors}
                />
                <AdditionalFacilitiesForm
                  formData={formData}
                  setFormData={setFormData}
                />
              </>
            )}

            {currentStep === 5 && (
              <BankDetailsForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
              />
            )}

            {/* Form Actions */}
            <HospitalFormActions
              onBack={handleBack}
              onSubmit={handleNext}
              isLoading={isLoading}
              isFormValid={isCurrentStepValid()}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </div>
        </div>
      </div>
    </div>
  );
}