import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HospitalHeader from "../../components/centerDetailsForm/HospitalHeader";
import HospitalProgressIndicator from "../../components/centerDetailsForm/HospitalProgessIndicator";
import BasicHospitalInfoForm from "../../components/centerDetailsForm/BasicHospitalInfoForm";
import OperatingHoursForm from "../../components/centerDetailsForm/OperatingHoursForm";
import DialysisDetailsForm from "../../components/centerDetailsForm/DialysisDetailsForm";
import HospitalLocationForm from "../../components/centerDetailsForm/HospitalLocationForm";
import BankDetailsForm from "../../components/centerDetailsForm/BankDetailsForm";
import HospitalFormActions from "../../components/centerDetailsForm/HospitalFormActions";
import api, { setAuthToken } from "../../services/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function CompleteHospitalProfile({ isEditMode = false }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const [formData, setFormData] = useState({
    hospitalName: "",
    email: "",
    phone: "",
    registrationNumber: "",
    is24x7: false,
    operatingHours: {},
    slots: {
      numberOf4HrsSessionsPerDay: 0,
      numberOf6HrsSessionsPerDay: 0,
      firstStart4h: "09:00",
      firstStart6h: "09:00",
      slots4h: [],
      slots6h: [],
    },
    dialysisSeats: "",
    dialysisType: "",
    priceFor4Hrs: "",
    priceFor6Hrs: "",
    priceForPD: "",
    address: "",
    latitude: null,
    longitude: null,
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const [errors, setErrors] = useState({});

  const normalizeType = (val) => (val || "").toLowerCase().trim();
  const requiresHemodialysisPrices = (val) =>
    ["hemodialysis", "hemo", "hd", "both"].includes(normalizeType(val));
  const requiresPDPrice = (val) =>
    ["peritoneal dialysis", "pd", "peritoneal", "both"].includes(normalizeType(val));

  useEffect(() => {
    const fetchPrefill = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (token) setAuthToken(token);

        const res = await api.get("/api/hospital/details");
        const hospital = res.data?.hospital ?? {};
        const prefill = res.data?.prefill ?? {};

        setFormData((prev) => ({
          ...prev,
          hospitalName: hospital.hospitalName ?? prefill.hospitalName ?? prev.hospitalName,
          email: prefill.email ?? hospital.email ?? prev.email,
          phone: hospital.phone ?? prev.phone,
          registrationNumber: hospital.registrationNumber ?? prev.registrationNumber,
          is24x7: hospital.is24x7 ?? prev.is24x7,
          operatingHours: hospital.operatingHours ?? prev.operatingHours,
          slots: {
            numberOf4HrsSessionsPerDay:
              hospital?.slots?.numberOf4HrsSessionsPerDay ??
              prefill?.slots?.numberOf4HrsSessionsPerDay ??
              prev.slots.numberOf4HrsSessionsPerDay,
            numberOf6HrsSessionsPerDay:
              hospital?.slots?.numberOf6HrsSessionsPerDay ??
              prefill?.slots?.numberOf6HrsSessionsPerDay ??
              prev.slots.numberOf6HrsSessionsPerDay,
            firstStart4h:
              hospital?.slots?.firstStart4h ??
              prefill?.slots?.firstStart4h ??
              prev.slots.firstStart4h,
            firstStart6h:
              hospital?.slots?.firstStart6h ??
              prefill?.slots?.firstStart6h ??
              prev.slots.firstStart6h,
            slots4h:
              hospital?.slots?.slots4h ??
              prefill?.slots?.slots4h ??
              prev.slots.slots4h,
            slots6h:
              hospital?.slots?.slots6h ??
              prefill?.slots?.slots6h ??
              prev.slots.slots6h,
          },
          dialysisSeats: hospital.dialysisSeats ?? prev.dialysisSeats,
          dialysisType: hospital.dialysisType ?? prev.dialysisType,
          priceFor4Hrs: hospital.priceFor4Hrs ?? prev.priceFor4Hrs,
          priceFor6Hrs: hospital.priceFor6Hrs ?? prev.priceFor6Hrs,
          priceForPD: hospital.priceForPD ?? prev.priceForPD,
          address: hospital.address ?? prev.address,
          latitude: hospital.latitude ?? prev.latitude,
          longitude: hospital.longitude ?? prev.longitude,
          accountHolderName: hospital.accountHolderName ?? prev.accountHolderName,
          bankName: hospital.bankName ?? prev.bankName,
          accountNumber: hospital.accountNumber ?? prev.accountNumber,
          ifscCode: hospital.ifscCode ?? prev.ifscCode,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrefill();
  }, []);

  const isStep2Valid = () => {
    if (formData.is24x7) return true;
    const oh = formData.operatingHours || {};
    const hasOpenDay = DAYS.some((d) => oh[d]?.closed === false);
    const slots = formData.slots || {};
    const hasSlots = (slots.slots4h?.length > 0) || (slots.slots6h?.length > 0);
    return hasOpenDay || hasSlots;
  };

  // central per-step validation used to enable Next button
  const isStepValid = (step) => {
    if (step === 1) {
      const hn = (formData.hospitalName || "").trim();
      if (hn.length < 3) return false;
      const email = (formData.email || "").trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValid) return false;
      const phoneDigits = (formData.phone || "").toString().replace(/\D/g, "");
      if (phoneDigits.length !== 10) return false;
      const reg = (formData.registrationNumber || "").trim();
      const regValid = /^\d{10}$/.test(reg);
      if (!regValid) return false;
      return true;
    }

    if (step === 2) {
      return isStep2Valid();
    }

    if (step === 3) {
      // NEW: require dialysis type to be selected before enabling Next
      if (!formData.dialysisType) return false;

      // dialysis seats + required prices depending on type
      const seatsOk = formData.dialysisSeats !== "" && !isNaN(Number(formData.dialysisSeats)) && Number(formData.dialysisSeats) > 0;
      if (!seatsOk) return false;
      const type = formData.dialysisType || "";
      if (requiresHemodialysisPrices(type)) {
        if (formData.priceFor4Hrs === "" || isNaN(Number(formData.priceFor4Hrs))) return false;
        if (formData.priceFor6Hrs === "" || isNaN(Number(formData.priceFor6Hrs))) return false;
      }
      if (requiresPDPrice(type)) {
        if (formData.priceForPD === "" || isNaN(Number(formData.priceForPD))) return false;
      }
      return true;
    }

    if (step === 4) {
      const addrOk = (formData.address || "").trim().length > 0;
      const latLngOk = formData.latitude !== null && formData.longitude !== null;
      return addrOk || latLngOk;
    }

    if (step === 5) {
      const accountOk = (formData.accountNumber || "").toString().trim().length >= 6;
      const ifscOk = (formData.ifscCode || "").toString().trim().length >= 4;
      return accountOk && ifscOk;
    }

    return false;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setGlobalError("");

    try {
      const s = formData.slots;
      if (
        s.slots4h.length !== s.numberOf4HrsSessionsPerDay ||
        s.slots6h.length !== s.numberOf6HrsSessionsPerDay
      ) {
        setGlobalError("Slot mismatch detected. Please reselect sessions.");
        setIsLoading(false);
        return;
      }

      const payload = {
        ...formData,
        dialysisSeats: Number(formData.dialysisSeats),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      if (!requiresHemodialysisPrices(formData.dialysisType)) {
        payload.priceFor4Hrs = undefined;
        payload.priceFor6Hrs = undefined;
      }

      if (!requiresPDPrice(formData.dialysisType)) {
        payload.priceForPD = undefined;
      }
      console.log("Submitting payload:", payload);
      const res = await api.post("/api/hospital/request-add", payload);
      const hid = res.data?.hospital?._id;
      if (hid) navigate("/login");
    } catch (err) {
      setGlobalError("Error saving hospital");
    } finally {
      setIsLoading(false);
    }
  };

  const goNext = () => setCurrentStep((s) => Math.min(totalSteps, s + 1));
  const goBack = () => setCurrentStep((s) => Math.max(1, s - 1));

  // central next handler - advances steps when valid, submits on final step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (isStepValid(currentStep)) {
        setCurrentStep((s) => s + 1);
      } else {
        // mark errors for step 3 dialysisType specifically (optional)
        if (currentStep === 3 && !formData.dialysisType) {
          setErrors((prev) => ({ ...prev, dialysisType: "Please select a dialysis type" }));
        }
      }
    } else {
      // final step -> submit
      handleSubmit();
    }
  };

  return (
    <div>
      <HospitalHeader />

      <HospitalProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

      {currentStep === 1 && (
        <BasicHospitalInfoForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />
      )}

      {currentStep === 2 && (
        <OperatingHoursForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />
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
        <HospitalLocationForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />
      )}

      {currentStep === 5 && (
        <BankDetailsForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />
      )}

      <HospitalFormActions
        onBack={goBack}
        onSubmit={handleNext}
        isLoading={isLoading}
        isFormValid={isStepValid(currentStep)}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      {globalError && <p style={{ color: "red" }}>{globalError}</p>}
    </div>
  );
}