import React, { useEffect, useState } from "react";
import {
  getMaintenanceRecords,
  createMaintenanceRecord,
} from "../../services/labAssistantService";

import { Wrench, CalendarDays, Settings } from "lucide-react";

const MaintenancePage = () => {
  const [records, setRecords] = useState([]);
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

  const badgeColor = (status) => {
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
                  <CalendarDays size={16} className="text-gray-500" />
                  {r.scheduledDate}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${badgeColor(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="p-3 text-gray-500">
                  {r.nextMaintenanceDate || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Schedule Maintenance</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Equipment Name"
                className="w-full p-2 border rounded"
                value={newRecord.equipmentName}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, equipmentName: e.target.value })
                }
              />

              <select
                className="w-full p-2 border rounded"
                value={newRecord.maintenanceType}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, maintenanceType: e.target.value })
                }
              >
                <option value="">Select Type</option>
                <option value="Routine Check">Routine Check</option>
                <option value="Repair">Repair</option>
                <option value="Calibration">Calibration</option>
              </select>

              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newRecord.scheduledDate}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, scheduledDate: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;
