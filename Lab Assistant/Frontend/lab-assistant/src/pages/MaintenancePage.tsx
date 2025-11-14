import React, { useEffect, useState } from "react";
import {
  getMaintenanceRecords,
  createMaintenanceRecord,
} from "../services/labAssistantService";

import { Wrench, CalendarDays, Settings } from "../lib/lucide-react";

interface MaintenanceRecord {
  id: number;
  equipmentName: string;
  maintenanceType: string;
  scheduledDate: string;
  status: string; // Scheduled, Completed, Overdue
  nextMaintenanceDate?: string;
}

const MaintenancePage: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    equipmentName: "",
    maintenanceType: "",
    scheduledDate: "",
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const data = await getMaintenanceRecords();
    setRecords(data);
  };

  const handleSubmit = async () => {
    if (!newRecord.equipmentName || !newRecord.maintenanceType || !newRecord.scheduledDate) return;

    await createMaintenanceRecord(newRecord);
    setShowModal(false);

    setNewRecord({
      equipmentName: "",
      maintenanceType: "",
      scheduledDate: "",
    });

    loadRecords();
  };

  const badgeColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">Equipment Maintenance</h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700"
        >
          <Wrench size={18} /> Schedule Maintenance
        </button>
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Equipment</th>
              <th className="p-3">Maintenance Type</th>
              <th className="p-3">Scheduled Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Next Maintenance</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-3 flex items-center gap-2">
                  <Settings size={16} className="text-gray-600" />
                  {r.equipmentName}
                </td>

                <td className="p-3">{r.maintenanceType}</td>

                <td className="p-3 flex items-center gap-2">
                  <CalendarDays size={16} className="text-gray-600" />
                  {r.scheduledDate}
                </td>

                <td className="p-3">
                  <span className={`px-3 py-1 rounded text-sm ${badgeColor(r.status)}`}>
                    {r.status}
                  </span>
                </td>

                <td className="p-3">
                  {r.nextMaintenanceDate ? r.nextMaintenanceDate : "—"}
                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500 text-lg">
                  No maintenance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">Schedule Maintenance</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Equipment Name"
                className="w-full border p-2 rounded"
                value={newRecord.equipmentName}
                onChange={(e) => setNewRecord({ ...newRecord, equipmentName: e.target.value })}
              />

              <input
                type="text"
                placeholder="Maintenance Type (Preventive / Repair / Calibration)"
                className="w-full border p-2 rounded"
                value={newRecord.maintenanceType}
                onChange={(e) => setNewRecord({ ...newRecord, maintenanceType: e.target.value })}
              />

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={newRecord.scheduledDate}
                onChange={(e) => setNewRecord({ ...newRecord, scheduledDate: e.target.value })}
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded mt-2 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MaintenancePage;
