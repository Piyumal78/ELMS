import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Wrench,
  Calendar,
  AlertTriangle,
  ClipboardList,
  Boxes,
} from "lucide-react";

import {
  getInventoryAlerts,
  getPendingMaintenance,
  getTodaySchedule,
} from "../../services/labAssistantService";

const DashboardHome = () => {
  const navigate = useNavigate();

  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const inv = await getInventoryAlerts();
    // Normalize inventory items to InventoryAlert shape (try common field names)
    setInventoryAlerts(
      inv.map((i) => ({
        id: i.id ?? i.inventoryId ?? 0,
        item: i.item ?? i.name ?? i.label ?? "Unknown Item",
        current: i.current ?? i.quantity ?? i.count ?? 0,
        minimum: i.minimum ?? i.min ?? 0,
      }))
    );

    // Normalize maintenance records to Maintenance shape (provide defaults for missing fields)
    const rawMaintenance = await getPendingMaintenance();
    setMaintenance(
      rawMaintenance.map((m) => ({
        id: m.id ?? m.maintenanceId ?? 0,
        equipmentName: m.equipmentName ?? m.equipment ?? m.name ?? "Unknown Equipment",
        issue: m.issue ?? m.description ?? "No description provided",
        priority:
          (m.priority) ??
          (m.priorityLevel
            ? m.priorityLevel === "H"
              ? "High"
              : m.priorityLevel === "M"
              ? "Medium"
              : m.priorityLevel === "L"
              ? "Low"
              : undefined
            : undefined) ??
          "Low",
      }))
    );

    setSchedule(await getTodaySchedule());
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-blue-700">Lab Assistant Dashboard</h1>
        <p className="text-gray-600">Monitor and manage daily lab operations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-3">
          <Boxes size={28} className="text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Total Inventory</p>
            <p className="text-xl font-bold">1,240</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-3">
          <AlertTriangle size={28} className="text-red-500" />
          <div>
            <p className="text-gray-500 text-sm">Low Stock Alerts</p>
            <p className="text-xl font-bold text-red-600">{inventoryAlerts.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-3">
          <Wrench size={28} className="text-orange-500" />
          <div>
            <p className="text-gray-500 text-sm">Pending Maintenance</p>
            <p className="text-xl font-bold text-orange-600">{maintenance.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-3">
          <Calendar size={28} className="text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Today's Labs</p>
            <p className="text-xl font-bold text-green-700">{schedule.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" /> Low Stock Alerts
            </h3>
            <button
              onClick={() => navigate("/lab-assistant/inventory")}
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {inventoryAlerts.length === 0 ? (
              <p className="text-gray-500 text-sm">No low stock alerts.</p>
            ) : (
              inventoryAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  <div>
                    <p className="font-medium text-gray-800">{alert.item}</p>
                    <p className="text-xs text-red-600">
                      Current: {alert.current} (Min: {alert.minimum})
                    </p>
                  </div>
                  <button className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Restock
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Maintenance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Wrench size={20} className="text-orange-500" /> Pending Maintenance
            </h3>
            <button
              onClick={() => navigate("/lab-assistant/maintenance")}
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {maintenance.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending maintenance.</p>
            ) : (
              maintenance.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100"
                >
                  <div>
                    <p className="font-medium text-gray-800">{task.equipmentName}</p>
                    <p className="text-xs text-gray-600">{task.issue}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      task.priority === "High"
                        ? "bg-red-200 text-red-800"
                        : task.priority === "Medium"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-blue-600" /> Today's Schedule
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">Time</th>
                <th className="p-3 border-b">Lab</th>
                <th className="p-3 border-b">Course</th>
                <th className="p-3 border-b">Students</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {schedule.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No labs scheduled for today.
                  </td>
                </tr>
              ) : (
                schedule.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b font-medium">{s.time}</td>
                    <td className="p-3 border-b">{s.lab}</td>
                    <td className="p-3 border-b">{s.course}</td>
                    <td className="p-3 border-b">{s.students}</td>
                    <td className="p-3 border-b">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
