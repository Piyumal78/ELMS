import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import LabAssistantDashboard from "./components/labassistant/LabAssistantDashboard";
import InventoryPage from "./pages/InventoryPage";
import RequestsPage from "./pages/RequestsPage";
import ProcurementPage from "./pages/ProcurementPage";
import MaintenancePage from "./pages/MaintenancePage";

export interface User {
  id?: number;
  name: string;
  email?: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User>({ name: "Lab Assistant", email: "assistant@example.com" });

  const handleLogout = () => {
    // simple logout handler - clear user (expand as needed)
    setUser({ name: "" });
  };

  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/labassistant/dashboard" replace />} />

      {/* Lab Assistant Routes */}
      <Route
        path="/labassistant/dashboard"
        element={<LabAssistantDashboard user={user} onLogout={handleLogout} />}
      />
      <Route path="/labassistant/inventory" element={<InventoryPage />} />
      <Route path="/labassistant/requests" element={<RequestsPage />} />
      <Route path="/labassistant/procurement" element={<ProcurementPage />} />
      <Route path="/labassistant/maintenance" element={<MaintenancePage />} />

      {/* Fallback */}
      <Route path="*" element={<div className="p-6 text-center">Page Not Found</div>} />
    </Routes>
  );
};

export default App;
