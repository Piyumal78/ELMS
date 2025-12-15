import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LabAssistantDashboard from './pages/LabAssistantDashboard'
import InventoryPage from './pages/InventoryPage'
import RequestsPage from './pages/RequestsPage'
import ProcurementPage from './pages/ProcurementPage'
import MaintenancePage from './pages/MaintenancePage'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<LabAssistantDashboard />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/procurement" element={<ProcurementPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App


