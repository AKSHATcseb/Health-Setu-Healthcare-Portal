import { useEffect, useState } from "react";
import EmergencyContactCard from "../../components/patientProfile/EmergencyContactCard";
import MedicalInfoCard from "../../components/patientProfile/MedicalInfoCard";
import ProfileCard from "../../components/patientProfile/ProfileCard";
import ProfileHeader from "../../components/patientProfile/ProfileHeader";
import { getMe } from "../../services/userApi";
import { useNavigate } from 'react-router-dom';

export default function PatientProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const res = await getMe();
  //       setUser(res.data);
  //     } catch (err) {
  //       console.error("Profile fetch error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMe();
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        // Check if the error indicates an authentication issue
        if (err.message === "Not logged in" || err.response?.status === 401) {
          navigate('/login'); // Redirect to login page
        }
        // Handle other errors as needed
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Profile not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 md:px-10 py-10">

      <ProfileHeader
        patientName={user.name}
      />


      <div className="mt-10 grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <ProfileCard email={user.email} phone={user.phone} age={user.age} gender={user.gender} weight={user.weight} address={user.address} />

        {/* RIGHT */}
        <MedicalInfoCard
          bloodGroup={user?.medicalInfo?.bloodGroup}
          dialysisType={user?.medicalInfo?.dialysisType}
        />

        <EmergencyContactCard
          emergencyName={user?.emergencyContact?.name}
          emergencyRelation={user?.emergencyContact?.relation}
          emergencyPhone={user?.emergencyContact?.phone}
        />


      </div>
    </div>
  );

}
