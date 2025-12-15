import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import HomePage from './pages/Home/HomePage.jsx'
import { Provider } from 'react-redux'
import { Routes,Route,BrowserRouter } from 'react-router-dom'
import RootLayout from './layout/Root.layout.jsx'
import SignUp from './Component/SignUp.jsx'
import Student from './pages/Student/Student'
import Lab from './pages/Lab/Lab'
import LabDetails from './pages/Lab/LabDetail'
import LabSubmission from './pages/Lab/LabSubmission'
import LabAssistantDashboard from './components/labassistant/LabAssistantDashboard'
import InventoryPage from './pages/LabAssistant/InventoryPage'
import RequestsPage from './pages/LabAssistant/RequestsPage'
import ProcurementPage from './pages/LabAssistant/ProcurementPage'
import MaintenancePage from './pages/LabAssistant/MaintenancePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} path='/'  />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/student' element={<Student />} />
          <Route path='/lab1' element={<LabDetails />} />
          <Route path='/lab2' element={<Lab />} />
          <Route path='/lab3' element={<Lab />} />
          <Route path='/lab4' element={<Lab />} />
          <Route path='/lab5' element={<Lab />} />
          <Route path='/lab6' element={<Lab />} />
          <Route path='/lab7' element={<Lab />} />
          <Route path='/submission' element={<LabSubmission />} />
          <Route path="/dashboard" element={<LabAssistantDashboard />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/procurement" element={<ProcurementPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
        </Route>
        <Route path='/lab-assistant' element={<LabAssistantDashboard user={{name: "Lab Assistant"}} onLogout={() => window.location.href='/'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
