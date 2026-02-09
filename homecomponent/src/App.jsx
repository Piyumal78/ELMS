import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import HomePage from './pages/Home/HomePage.jsx'
import { Provider } from 'react-redux'
import { Routes,Route,BrowserRouter } from 'react-router-dom'
import RootLayout from './layout/Root.layout.jsx'
import SignUp from './Component/SignUp.jsx'
import SignIn from './Component/SignIn.jsx'
import Student from './pages/Student/Student'
import Lab from './pages/Lab/Lab'
import LabDetails from './Component/LabDetail'
import LabSubmission from './pages/Lab/LabSubmission'
import LoginExample from './components/LoginExample.jsx'
import { StudentRoute, StaffRoute, ProtectedRoute } from './components/ProtectedRoute'
import CourseEnrollPage from './pages/Student/CourseEnroll'
import Grades from './pages/Student/Grades'
import LabBooking from './pages/Lab/Labbooking'
import Announcements from './Component/Announcements'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} path='/'  />
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
          
          <Route path='/grades' element={
            <StudentRoute>
              <Grades />
            </StudentRoute>
          } />
          
          <Route path='/lab-booking' element={
            <StudentRoute>
              <LabBooking />
            </StudentRoute>
          } />
          
          <Route path='/announcements' element={
            <StudentRoute>
              <Announcements />
            </StudentRoute>
          } />
          
          <Route path='/login' element={<LoginExample />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
