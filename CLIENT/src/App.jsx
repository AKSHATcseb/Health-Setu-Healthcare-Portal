import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'


import Home from './pages/Public/LandingPage'
import LoginForm from './components/loginSignup/LoginForm'
import SelectRolePage from './pages/auth/SelectRolePage'
import Register from './components/loginSignup/Register'
import PatientDetailsForm from './components/loginSignup/PatientDetailsForm'
import CenterDetailsForm from './components/loginSignup/CenterDetailsForm'
import PatientDashboard from './pages/Patient/PatientDashboard'
import CenterDashboard from './pages/Center/CenterDashboard'
import MyAppointments from './pages/Patient/MyAppointments'
import NewBookingPage from './pages/Patient/NewBookingPage'
import CenterDetails from './pages/Patient/CenterDetails'
import BookingConfirmation from './pages/Patient/BookingConfirmation'
import PatientProfile from './pages/Patient/PatientProfile'
import EditProfile from './pages/Patient/EditProfile'
import AvailableCenters from './pages/Patient/AvailableCenters'
import ConfirmAppointment from './pages/Patient/ConfirmAppointment'
import CenterUpdateDetails from './pages/Center/CenterUpdateDetails'
import Payment from './pages/Patient/Payment'

// import { Toaster } from 'react-hot-toast'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/roleselector" element={<SelectRolePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient/details" element={<PatientDetailsForm />} />
        <Route path="/center/details" element={<CenterDetailsForm />} />
        <Route path='/patient/dashboard' element={<PatientDashboard />} />
        <Route path='/center/dashboard' element={<CenterDashboard />} />
        <Route path='/patient/myappointments' element={<MyAppointments />} />
        <Route path='/patient/bookappointment' element={<NewBookingPage />} />
        <Route path='/center/:cid' element={<CenterDetails />} />
        <Route path='/patient/bookingconfirmation' element={<BookingConfirmation />} />
        <Route path='/patient/profile' element={<PatientProfile />} />
        <Route path='/patient/profile/edit' element={<EditProfile />} />
        <Route path='/patient/bookappointment/searchresults' element={<AvailableCenters />} />
        <Route path='/patient/bookappointment/searchresults/confirm' element={<ConfirmAppointment />} />/
        <Route path='/center/update' element={<CenterUpdateDetails />} />/
        <Route path='/confirm' element={<Payment />} />/
      </Routes>
    </>
  )
}

export default App