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
// import SelectRolePage from './pages/auth/SelectRolePage'
// import PatientDetailsForm from './components/loginSignup/PatientDetailsForm'
// import CenterDetailsForm from './components/loginSignup/CenterDetailsForm'
// import CenterDashboard from './pages/Center/CenterDashboard'
// import CenterDetails from './pages/Patient/CenterDetails'
// import BookingConfirmation from './pages/Patient/BookingConfirmation'
// import PatientProfile from './pages/Patient/PatientProfile'
// import EditProfile from './pages/Patient/EditProfile'
// import AvailableCenters from './pages/Patient/AvailableCenters'
// import ConfirmAppointment from './pages/Patient/ConfirmAppointment'
// import CenterUpdateDetails from './pages/Center/CenterUpdateDetails'
// import Payment from './pages/Patient/Payment'

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
        {/* <Route path="/roleselector" element={<SelectRolePage />} /> */}
        {/* <Route path="/patient/details" element={<PatientDetailsForm />} /> */}
        {/* <Route path="/center/details" element={<CenterDetailsForm />} /> */}
        {/* <Route path='/center/dashboard' element={<CenterDashboard />} /> */}
        {/* <Route path='/center/:cid' element={<CenterDetails />} /> */}
        {/* <Route path='/patient/bookingconfirmation' element={<BookingConfirmation />} /> */}
        {/* <Route path='/patient/profile' element={<PatientProfile />} /> */}
        {/* <Route path='/patient/profile/edit' element={<EditProfile />} /> */}
        {/* <Route path='/patient/bookappointment/searchresults' element={<AvailableCenters />} /> */}
        {/* <Route path='/patient/bookappointment/searchresults/confirm' element={<ConfirmAppointment />} />/ */}
        {/* <Route path='/center/update' element={<CenterUpdateDetails />} />/ */}
        {/* <Route path='/confirm' element={<Payment />} />/ */}
      </Routes>
    </>
  )
}

export default App