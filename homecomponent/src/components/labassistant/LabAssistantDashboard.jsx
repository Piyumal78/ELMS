import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardHome from "../../pages/LabAssistant/DashboardHome";
import InventoryPage from "../../pages/LabAssistant/InventoryPage";
import RequestsPage from "../../pages/LabAssistant/RequestsPage";
import ProcurementPage from "../../pages/LabAssistant/ProcurementPage";
import MaintenancePage from "../../pages/LabAssistant/MaintenancePage";

export const LabAssistantDashboard = ({
  user,
  onLogout,
}) => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardHome onNavigate={setActivePage} />;
      case "inventory":
        return <InventoryPage />;
      case "requests":
        return <RequestsPage />;
      case "procurement":
        return <ProcurementPage />;
      case "maintenance":
        return <MaintenancePage />;
      default:
        return <InventoryPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar active={activePage} onChangePage={setActivePage} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        <Topbar user={user} onLogout={onLogout} />

        <div className="p-6">{renderPage()}</div>
      </div>
    </div>
  );
};

export default LabAssistantDashboard;
