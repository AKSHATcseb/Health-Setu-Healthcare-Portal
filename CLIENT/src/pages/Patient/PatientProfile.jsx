import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePageHeader from "../../components/patientProfile/ProfilePageHeader";
import ProfileStats from "../../components/patientProfile/ProfileStats";
import PersonalInfoSection from "../../components/patientProfile/PersonalInfoSection";
import MedicalInfoSection from "../../components/patientProfile/MedicalInfoSection";
import LocationInfoSection from "../../components/patientProfile/LocationInfoSection";
import EmergencyContactSection from "../../components/patientProfile/EmergencyContactSection";
import MedicalHistorySection from "../../components/patientProfile/MedicalHistorySection";
import ProfileActionButtons from "../../components/patientProfile/ProfileActionButtons";

export default function PatientProfile() {
  const navigate = useNavigate();

  // Sample patient data - Replace with actual API data
  const patientData = {
    personalInfo: {
      fullName: "John David Martinez",
      email: "john.martinez@email.com",
      mobileNumber: "+1 (555) 123-4567",
      dateOfBirth: "March 15, 1980",
    },
    medicalInfo: {
      age: 45,
      gender: "Male",
      bloodGroup: "O+",
      dialysisStatus: "Regular (3x per week)",
      allergies: "Penicillin, Latex",
    },
    locationInfo: {
      address: "123 Medical Plaza, Healthcare District, City, State 12345",
      latitude: 40.7128,
      longitude: -74.006,
    },
    emergencyContact: {
      name: "Sarah Martinez",
      relationship: "Spouse",
      phone: "+1 (555) 987-6543",
    },
    medicalHistory: [
      {
        condition: "Type 2 Diabetes",
        date: "2015",
        description: "Diagnosed with Type 2 Diabetes. Currently managed with medication.",
      },
      {
        condition: "Chronic Kidney Disease",
        date: "2018",
        description: "Stage 5 CKD. Started dialysis treatment in 2020.",
      },
      {
        condition: "Hypertension",
        date: "2010",
        description: "Managed with antihypertensive medications.",
      },
    ],
    stats: {
      totalAppointments: 48,
      completed: 45,
      upcoming: 2,
      pending: 1,
    },
  };

  const handleEdit = () => {
    console.log("Edit profile");
    navigate("/patient/detailsForm");
  };

  const handleDownload = () => {
    console.log("Download records");
    // Implement download functionality
    alert("Medical records download feature will be available soon!");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      console.log("Logout");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-teal-50">
      <ProfilePageHeader
        patientName={patientData.personalInfo.fullName}
        onEdit={handleEdit}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Statistics */}
          <ProfileStats stats={patientData.stats} />

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <PersonalInfoSection personalInfo={patientData.personalInfo} />

              {/* Medical Information */}
              <MedicalInfoSection medicalInfo={patientData.medicalInfo} />

              {/* Location Information */}
              <LocationInfoSection locationInfo={patientData.locationInfo} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <EmergencyContactSection
                emergencyContact={patientData.emergencyContact}
              />

              {/* Action Buttons */}
              <ProfileActionButtons
                onEdit={handleEdit}
                onDownload={handleDownload}
                onLogout={handleLogout}
              />
            </div>
          </div>

          {/* Medical History - Full Width */}
          <div className="mt-6">
            <MedicalHistorySection medicalHistory={patientData.medicalHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}