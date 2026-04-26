import React, { useState, useEffect } from "react";
import SlotSelector from "../../components/appointmentConfirmationPage/SlotSelector";
import PatientInfo from "../../components/appointmentConfirmationPage/PatientInfo";
import HospitalDetails from "../../components/appointmentConfirmationPage/HospitalDetails";
import PaymentMethod from "../../components/appointmentConfirmationPage/PaymentMethod";
import AppointmentSummary from "../../components/appointmentConfirmationPage/AppointmentSummary";
import ConfirmationButtons from "../../components/appointmentConfirmationPage/ConfirmationButtons";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import api from "../../services/api";

export default function AppointmentConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hospital, appointment } = location.state || {};

  const { patientId, id } = useParams();

  const [patientData, setPatientData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState("review");

  // 🔥 FETCH DATA CLEANLY
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        console.log("Fetching data for patientId:", patientId, "and hospitalId:", id);

        const [p1, h1] = await Promise.all([
          api.get(`/api/patient/${patientId}`),
          api.get(`/api/hospital/fetch/${id}`)
        ]);

        const patientRes =
          p1.data?.patientFromPatientModel || p1.data;

        const hospitalRes =
          h1.data?.hospital || h1.data;

        setPatientData(patientRes);
        setHospitalData(hospitalRes);

      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId && id) {
      fetchData();
    }
  }, [patientId, id]);

  // 🔥 LOADING UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading data...</p>
      </div>
    );
  }

  // 🔥 SAFETY CHECK
  if (!patientData || !hospitalData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load data</p>
      </div>
    );
  }

  const appointmentData = {
    date: appointment?.date,
    timeSlot: selectedSlot || "To be selected",
    hospitalName: hospitalData?.hospitalName,
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    const slotHours = selectedSlot?.type === "4h" ? 4 :
      selectedSlot?.type === "6h" ? 6 :
        selectedSlot?.type === "pd" ? 12 : 0;

    const amount = selectedSlot?.type === "4h" ? hospitalData?.priceFor4Hrs :
      selectedSlot?.type === "6h" ? hospitalData?.priceFor6Hrs :
        selectedSlot?.type === "pd" ? hospitalData?.priceForPD : 0;

    try {
      if (!selectedSlot?.machineId || !selectedSlot?.slot) {
        alert("Please select a machine and slot");
        return;
      }

      // console.log("Booking with:", {
      //   appointment: appointment,
      //   patientId,
      //   machineId,
      //   hospitalId: id,
      //   appointmentDate: appointment?.date,
      //   durationHours: slotHours,
      //   slot: selectedSlot.slot,
      //   amount: amount
      // });

      const res = await api.post("/api/appointment/confirm", {
        patientId,
        machineId,
        hospitalId: id,
        appointmentDate: appointment?.date,
        durationHours: slotHours,
        slot: selectedSlot,
        amount: amount,
      });

      console.log("Response:", res.data);

      setConfirmationStep("success");

    } catch (error) {
      console.error("Booking failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  // 🔥 SUCCESS SCREEN
  if (confirmationStep === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl text-center shadow-lg">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Appointment Confirmed</h2>
          <button
            onClick={() => navigate(`/patient/dashboard/${patientId}`)}
            className="bg-green-600 text-white rounded-xl px-4 py-2 mt-5 shadow shadow-slate-500">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-slate-200">

      <div className="pb-2 font-bold text-slate-800 text-center">Confirm You Appointment</div>

      <AppointmentSummary appointment={appointmentData} />

      <SlotSelector
        hospital={hospital}
        onSelectSlot={setSelectedSlot}
      />


      <PatientInfo patientData={patientData} />

      <HospitalDetails hospitalData={hospitalData} />


      <PaymentMethod
        selectedSlot={selectedSlot}
        hospitalData={hospitalData}
      />

      <ConfirmationButtons
        disabled={!selectedSlot}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={isLoading}
        agreeToTerms={agreeToTerms}
        setAgreeToTerms={setAgreeToTerms}
      />
    </div>
  );
}