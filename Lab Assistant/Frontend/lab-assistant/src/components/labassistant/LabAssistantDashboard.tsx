import React, { useState } from "react";
import Sidebar from "./../labassistant/Sidebar";
import Topbar from "./../labassistant/Topbar";
import InventoryPage from "../../pages/InventoryPage";
import RequestsPage from "../../pages/RequestsPage";
import ProcurementPage from "../../pages/ProcurementPage";
import MaintenancePage from "../../pages/MaintenancePage";
import { User } from "../../App";

interface LabAssistantDashboardProps {
  user: User;
  onLogout: () => void;
}

export const LabAssistantDashboard: React.FC<LabAssistantDashboardProps> = ({
  user,
  onLogout,
}) => {
  const [activePage, setActivePage] = useState<string>("inventory");

  const renderPage = () => {
    switch (activePage) {
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
