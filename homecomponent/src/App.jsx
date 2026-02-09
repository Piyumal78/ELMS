import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import HomePage from './pages/Home/HomePage.jsx'
import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter, Outlet } from 'react-router-dom'
import RootLayout from './layout/Root.layout.jsx'
import SignUp from './Component/SignUp.jsx'
import SignIn from './Component/SignIn.jsx'
import Student from './pages/Student/Student'
import Lab from './pages/Lab/Lab'
import LabDetails from './Component/LabDetail'
import LabSubmission from './pages/Lab/LabSubmission'

// Import Lab Assistant Pages and Layout from Frontend
import Layout from '../../Frontend/src/components/Layout.jsx'
import LabAssistantDashboard from '../../Frontend/src/pages/LabAssistantDashboard.jsx'
import InventoryPage from '../../Frontend/src/pages/InventoryPage.jsx'
import RequestsPage from '../../Frontend/src/pages/RequestsPage.jsx'
import ProcurementPage from '../../Frontend/src/pages/ProcurementPage.jsx'
import MaintenancePage from '../../Frontend/src/pages/MaintenancePage.jsx'
import ReportsPage from '../../Frontend/src/pages/ReportsPage.jsx'
import CreateRequestPage from '../../Frontend/src/pages/CreateRequestPage.jsx'

import LoginExample from './components/LoginExample.jsx'
import { StudentRoute, StaffRoute, ProtectedRoute, LecturerRoute } from './components/ProtectedRoute'
import CourseEnrollPage from './pages/Student/CourseEnroll'
import Grades from './pages/Student/Grades'
import LabBooking from './pages/Lab/Labbooking'
import Announcements from './Component/Announcements'
import Profile from './Component/Profile.jsx'
import HelpSupport from './pages/HelpSupport.jsx'
import ChatInterface from './Component/ChatInterface.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import Demonstrator Pages
import DemonstratorDashboard from '../../Frontend/src/pages/Demonstrator/DemonstratorDashboard.jsx'
import DemoSessionManager from '../../Frontend/src/pages/Demonstrator/DemoSessionManager.jsx'
import DemoReportReviews from '../../Frontend/src/pages/Demonstrator/DemoReportReviews.jsx'
import DemonstratorProfile from '../../Frontend/src/pages/Demonstrator/DemonstratorProfile.jsx'

// Import Lecture Portal Pages
import LecturerHome from '../../Lecture-Portal/src/pages/home/Home.jsx'
import LecturerLogin from '../../Lecture-Portal/src/pages/login/Login.jsx'
import LecturerNew from '../../Lecture-Portal/src/pages/new/New.jsx'
import LecturerSingle from '../../Lecture-Portal/src/pages/single/Single.jsx'
import LecturerList from '../../Lecture-Portal/src/pages/list/List.jsx'
import LecturerLabSessions from '../../Lecture-Portal/src/pages/labsessions/LabSessions.jsx'
import LecturerAttendance from '../../Lecture-Portal/src/pages/attendance/Attendance.jsx'
import LecturerResources from '../../Lecture-Portal/src/pages/resources/Resources.jsx'
import LecturerProfile from '../../Lecture-Portal/src/pages/profile/Profile.jsx'
import LecturerCourses from '../../Lecture-Portal/src/pages/courses/Courses.jsx'
import LecturerAnnouncements from '../../Lecture-Portal/src/pages/announcements/Announcements.jsx'
import LecturerReservations from '../../Lecture-Portal/src/pages/reservations/Reservations.jsx'
import { studentInputs, labSessionInputs } from '../../Lecture-Portal/src/formSource.js'
import { AuthProvider as LecturerAuthProvider } from '../../Lecture-Portal/src/context/AuthContext.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} />
      <Routes>
        {/* Public and Student Routes using RootLayout */}
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

          <Route path='/profile' element={
            <StudentRoute>
              <Profile />
            </StudentRoute>
          } />

          <Route path='/help' element={
            <StudentRoute>
              <HelpSupport />
            </StudentRoute>
          } />

          <Route path='/ai-chat' element={
            <StudentRoute>
              <ChatInterface />
            </StudentRoute>
          } />
          

          <Route path='/login' element={<LoginExample />} />
        </Route>

        {/* Lab Assistant Routes using Frontend Layout */}
        <Route element={
          <StaffRoute>
            <Layout>
              <Outlet />
            </Layout>
          </StaffRoute>
        }>
          <Route path="/dashboard" element={<LabAssistantDashboard />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/requests/new" element={<CreateRequestPage />} />
          <Route path="/procurement" element={<ProcurementPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* Demonstrator Routes - Protected by StaffRoute but uses its own Layout */}
        <Route element={
          <StaffRoute>
            <Outlet />
          </StaffRoute>
        }>
          <Route path="/demonstrator/dashboard" element={<DemonstratorDashboard />} />
          <Route path="/demonstrator/sessions" element={<DemoSessionManager />} />
          <Route path="/demonstrator/reports" element={<DemoReportReviews />} />
          <Route path="/demonstrator/profile" element={<DemonstratorProfile />} />
        </Route>

        {/* Lecturer Portal Routes - Protected by LecturerRoute */}
        <Route path="/lecturer" element={
          <LecturerAuthProvider>
            <Outlet />
          </LecturerAuthProvider>
        }>
          {/* Lecturer Login - Public */}
          <Route path="login" element={<LecturerLogin />} />
          
          {/* Lecturer Dashboard */}
          <Route index element={
            <LecturerRoute>
              <LecturerHome />
            </LecturerRoute>
          } />
          
          {/* Courses Routes */}
          <Route path="courses" element={
            <LecturerRoute>
              <LecturerCourses />
            </LecturerRoute>
          } />
          
          {/* Announcements Route */}
          <Route path="announcements" element={
            <LecturerRoute>
              <LecturerAnnouncements />
            </LecturerRoute>
          } />
          
          {/* Reservations Route */}
          <Route path="reservations" element={
            <LecturerRoute>
              <LecturerReservations />
            </LecturerRoute>
          } />
          
          {/* Students Routes */}
          <Route path="students">
            <Route index element={
              <LecturerRoute>
                <LecturerList />
              </LecturerRoute>
            } />
            <Route path=":studentId" element={
              <LecturerRoute>
                <LecturerSingle />
              </LecturerRoute>
            } />
            <Route path="new" element={
              <LecturerRoute>
                <LecturerNew inputs={studentInputs} title="Add New Student" />
              </LecturerRoute>
            } />
          </Route>
          
          {/* Lab Sessions Routes */}
          <Route path="labsessions">
            <Route index element={
              <LecturerRoute>
                <LecturerLabSessions />
              </LecturerRoute>
            } />
            <Route path="new" element={
              <LecturerRoute>
                <LecturerNew inputs={labSessionInputs} title="Create Lab Session" />
              </LecturerRoute>
            } />
          </Route>
          
          {/* Attendance Route */}
          <Route path="attendance" element={
            <LecturerRoute>
              <LecturerAttendance />
            </LecturerRoute>
          } />
          
          {/* Resources Route */}
          <Route path="resources" element={
            <LecturerRoute>
              <LecturerResources />
            </LecturerRoute>
          } />
          
          {/* Profile Route */}
          <Route path="profile" element={
            <LecturerRoute>
              <LecturerProfile />
            </LecturerRoute>
          } />
        </Route>

        {/* Legacy route kept just in case */}
        <Route path='/lab-assistant' element={<LabAssistantDashboard user={{ name: "Lab Assistant" }} onLogout={() => window.location.href = '/'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
