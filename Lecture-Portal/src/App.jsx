import React from 'react'
import Home from '../../homecomponent/src/pages/Home.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login.jsx'
import New from './pages/new/New.jsx'
import Single from './pages/single/Single.jsx'
import List from './pages/list/List.jsx'
import LabSessions from './pages/labsessions/LabSessions.jsx'
import Attendance from './pages/attendance/Attendance.jsx'
import Resources from './pages/resources/Resources.jsx'
import Profile from './pages/profile/Profile.jsx'
import Courses from './pages/courses/Courses.jsx'
import Announcements from './pages/announcements/Announcements.jsx'
import Reservations from './pages/reservations/Reservations.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { studentInputs, labSessionInputs } from './formSource.js'

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          {/* Login Route - No sidebar/navbar */}
          <Route path='/login' element={<Login />} />
          
          {/* Main Routes with Layout - Protected */}
          <Route path='/'>
            <Route index element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            {/* Courses Routes */}
            <Route path='courses'>
              <Route index element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Announcements Route */}
            <Route path='announcements' element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            } />
            
            {/* Reservations Route */}
            <Route path='reservations' element={
              <ProtectedRoute>
                <Reservations />
              </ProtectedRoute>
            } />
            
            {/* Students Routes */}
            <Route path='students'>
              <Route index element={
                <ProtectedRoute>
                  <List />
                </ProtectedRoute>
              } />
              <Route path=':studentId' element={
                <ProtectedRoute>
                  <Single />
                </ProtectedRoute>
              } />
              <Route path='new' element={
                <ProtectedRoute>
                  <New inputs={studentInputs} title="Add New Student" />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Lab Sessions Routes */}
            <Route path='labsessions'>
              <Route index element={
                <ProtectedRoute>
                  <LabSessions />
                </ProtectedRoute>
              } />
              <Route path='new' element={
                <ProtectedRoute>
                  <New inputs={labSessionInputs} title="Create Lab Session" />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Attendance Route */}
            <Route path='attendance' element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            } />
            
            {/* Resources Route */}
            <Route path='resources' element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            } />
            
            {/* Profile Route */}
            <Route path='profile' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
