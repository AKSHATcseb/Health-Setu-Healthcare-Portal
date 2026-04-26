import React, { useState } from "react";
import SlotSelector from "../../components/appointmentConfirmationPage/SlotSelector";
import AppointmentSummary from "../../components/appointmentConfirmationPage/AppointmentSummary";
import PatientInfo from "../../components/appointmentConfirmationPage/PatientInfo";
import HospitalDetails from "../../components/appointmentConfirmationPage/HospitalDetails";
import PaymentBreakdown from "../../components/appointmentConfirmationPage/PaymentBreakdown";
import PaymentMethod from "../../components/appointmentConfirmationPage/PaymentMethod";
import ConfirmationButtons from "../../components/appointmentConfirmationPage/ConfirmationButtons";
import { useLocation, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import api, { setAuthToken } from "../../services/api";

export default function AppointmentConfirmation() {
  const location = useLocation();
  const { hospital, appointment } = location.state || {};
  // console.log("Received data in AppointmentConfirmation:", { hospital, patient, appointment });
  // const [patient, setPatient] = useState(null);
  // const [hospitalForID, setHospitalForID] = useState(null);

  const { patientId, id } = useParams();
  
  // let [patientKaData, setPatientKaData] = useState(null);
  // let [hospitalKaData, setHospitalKaData] = useState(null);

  let [patientData, setPatientData] = useState(null);
  let [hospitalData, setHospitalData] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const p1 = await api.get(`/api/patient/${patientId}`);
        // patientData = p1.data?.patientFromPatientModel || p1.data;
        setPatientData(res.data?.patientFromPatientModel || res.data);
        console.log("patientData", patientData);
        // setPatientKaData(patientData);
        console.log("PatientData:", patientData);


        const h1 = await api.get(`/api/hospital/fetch/${id}`);
        hospitalData = h1.data?.hospitalFromHospitalModel || h1.data;
        // setHospitalKaData(hospitalData);

        console.log("hospitalData", hospitalData);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [patientId, id]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState("review"); // review, success

  const appointmentData = {
    date: appointment?.date,
    timeSlot: "To be selected", // you can improve later
    hospitalName: hospital?.hospitalName,
  };


  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Here you would call your payment API
      console.log("Appointment confirmed with payment method:", selectedPaymentMethod);
      setConfirmationStep("success");
    } catch (error) {
      console.error("Error confirming appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to previous page
    console.log("Appointment cancelled");
    window.history.back();
  };

  if (confirmationStep === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-green-300 p-8 shadow-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 animate-bounce">
                <CheckCircle size={48} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Appointment Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully booked and payment processed.
            </p>

            <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-left border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Confirmation Number</p>
              <p className="text-2xl font-bold text-blue-600">APT-2026-03-15-001</p>
            </div>

            <p className="text-gray-700 mb-6">
              Check your email for the full appointment details and receipt.
            </p>

            <button className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-10 px-4">
      <div className="mx-auto">

        {/* Components */}
        <SlotSelector
          hospital={hospital}
          onSelectSlot={setSelectedSlot}
        />
        <AppointmentSummary appointment={appointmentData} />
        <PatientInfo patientData={patientData} />
        {/* <HospitalDetails hospitalKaData={hospitalKaData} />  */}
        {/* <PaymentBreakdown pricing={hospital} /> */}
        <PaymentMethod
          selectedMethod={selectedPaymentMethod}
          setSelectedMethod={setSelectedPaymentMethod}
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
    </div>
  );
}