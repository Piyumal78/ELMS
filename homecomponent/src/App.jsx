import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import HomePage from './pages/Home/HomePage.jsx'
import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import RootLayout from './layout/Root.layout.jsx'
import SignUp from './Component/SignUp.jsx'
import SignIn from './Component/SignIn.jsx'
import Student from './pages/Student/Student'
import Lab from './pages/Lab/Lab'
import LabDetails from './Component/LabDetail'
import LabSubmission from './pages/Lab/LabSubmission'
import LabAssistantDashboard from '../Frontend/src/pages/LabAssistantDashboard'
import InventoryPage from '../Frontend/src/pages/InventoryPage'
import RequestsPage from '../Frontend/src/pages/RequestsPage'
import ProcurementPage from '../Frontend/src/pages/ProcurementPage'
import MaintenancePage from '../Frontend/src/pages/MaintenancePage'
import LoginExample from './components/LoginExample.jsx'
import { StudentRoute, StaffRoute, ProtectedRoute } from './components/ProtectedRoute'
import CourseEnrollPage from './pages/Student/CourseEnroll'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} path='/' />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<SignIn />} />

          {/* Student only access routes */}
          <Route path='/student' element={
            <StudentRoute>
              <Student />
            </StudentRoute>
          } />
          <Route path='/course-enroll' element={
            <StudentRoute>
              <CourseEnrollPage />
            </StudentRoute>
          } />
          <Route path='/course-enroll/:courseCode' element={
            <StudentRoute>
              <CourseEnrollPage />
            </StudentRoute>
          } />

          {/* Dynamic Lab Details Route - Single route for all courses */}
          <Route path='/lab-details/:courseCode' element={
            <StudentRoute>
              <LabDetails />
            </StudentRoute>
          } />

          <Route path='/submission' element={
            <StudentRoute>
              <LabSubmission />
            </StudentRoute>
          } />

          {/* Staff only access routes */}
          <Route path="/dashboard" element={
            <StaffRoute>
              <LabAssistantDashboard />
            </StaffRoute>
          } />
          <Route path="/inventory" element={
            <StaffRoute>
              <InventoryPage />
            </StaffRoute>
          } />
          <Route path="/requests" element={
            <StaffRoute>
              <RequestsPage />
            </StaffRoute>
          } />
          <Route path="/procurement" element={
            <StaffRoute>
              <ProcurementPage />
            </StaffRoute>
          } />
          <Route path="/maintenance" element={
            <StaffRoute>
              <MaintenancePage />
            </StaffRoute>
          } />

          <Route path='/login' element={<LoginExample />} />
        </Route>
        <Route path='/lab-assistant' element={<LabAssistantDashboard user={{ name: "Lab Assistant" }} onLogout={() => window.location.href = '/'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
