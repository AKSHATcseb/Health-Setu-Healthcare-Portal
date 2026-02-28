import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'


import Home from './pages/Public/LandingPage'
import LoginForm from './components/loginSignup/LoginForm'
import Register from './components/loginSignup/Register'
import PatientDashboard from './pages/Patient/PatientDashboard'
import BookingPage from './pages/Patient/BookingPage'
import AppointmentConfirmation from './pages/Patient/AppointmentConfirmation'
import MyAppointments from './pages/Patient/MyAppointments'
import PatientDetailsForm from './pages/Patient/CompleteProfile'
import PatientProfile from './pages/Patient/PatientProfile'
import CenterDetailsForm from './pages/Center/CenterDetailsForm'
import HospitalRegistrationSuccess from './pages/Center/HospitalRegistraionSuccess'
import CenterDashboard from './pages/Center/CenterDashboard'
import EditProfile from './pages/Patient/EditProfile'
import CenterUpdateDetails from './pages/Center/CenterUpdateDetails'
import CompleteCenterDetail from './pages/Patient/CompleteCenterDetail'

// import { Toaster } from 'react-hot-toast'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path='/patient/dashboard' element={<PatientDashboard />} />
        <Route path='/patient/bookingpage' element={<BookingPage />} />
        <Route path='/patient/appointmentconfirmation' element={<AppointmentConfirmation />} />
        <Route path='/patient/myappointments' element={<MyAppointments />} />
        <Route path="/patient/detailsForm" element={<PatientDetailsForm />} />
        <Route path='/patient/profile' element={<PatientProfile />} />
        <Route path="/center/detailsForm" element={<CenterDetailsForm />} />
        <Route path="/center/registration-success" element={<HospitalRegistrationSuccess />} />
        <Route path='/center/dashboard' element={<CenterDashboard />} />
        <Route path='/patient/profile/edit' element={<EditProfile />} />
        <Route path='/center/update' element={<CenterUpdateDetails />} />
        <Route path='/center/:cid' element={<CompleteCenterDetail />} />
      </Routes>
    </>
  )
}

export default App