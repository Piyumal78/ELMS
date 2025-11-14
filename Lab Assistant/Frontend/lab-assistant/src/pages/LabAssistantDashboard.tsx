import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Wrench,
  Calendar,
  AlertTriangle,
  ClipboardList,
  Boxes,
} from "../lib/lucide-react";

import {
  getInventoryAlerts,
  getPendingMaintenance,
  getTodaySchedule,
} from "../services/labAssistantService";

interface InventoryAlert {
  id: number;
  item: string;
  current: number;
  minimum: number;
}

interface Maintenance {
  id: number;
  equipmentName: string;
  issue: string;
  priority: "Low" | "Medium" | "High";
}

interface Schedule {
  id: number;
  lab: string;
  course: string;
  students: number;
  time: string;
}

const LabAssistantDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const inv = await getInventoryAlerts();
    // Normalize inventory items to InventoryAlert shape (try common field names)
    setInventoryAlerts(
      inv.map((i: any) => ({
        id: i.id ?? i.inventoryId ?? 0,
        item: i.item ?? i.name ?? i.label ?? "Unknown Item",
        current: i.current ?? i.quantity ?? i.count ?? 0,
        minimum: i.minimum ?? i.min ?? 0,
      }))
    );

    // Normalize maintenance records to Maintenance shape (provide defaults for missing fields)
    const rawMaintenance = await getPendingMaintenance();
    setMaintenance(
      rawMaintenance.map((m: any) => ({
        id: m.id ?? m.maintenanceId ?? 0,
        equipmentName: m.equipmentName ?? m.equipment ?? m.name ?? "Unknown Equipment",
        issue: m.issue ?? m.description ?? "No description provided",
        priority:
          (m.priority as "Low" | "Medium" | "High") ??
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
            <p className="text-gray-600 text-sm">Low Stock</p>
            <p className="text-xl font-bold text-blue-700">{inventoryAlerts.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-3">
          <Wrench size={28} className="text-yellow-500" />
          <div>
            <p className="text-gray-600 text-sm">Pending Maintenance</p>
            <p className="text-xl font-bold text-yellow-600">{maintenance.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-3">
          <Calendar size={28} className="text-green-600" />
          <div>
            <p className="text-gray-600 text-sm">Today’s Sessions</p>
            <p className="text-xl font-bold text-green-700">{schedule.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-3">
          <Package size={28} className="text-purple-600" />
          <div>
            <p className="text-gray-600 text-sm">Total Tasks</p>
            <p className="text-xl font-bold text-purple-700">
              {inventoryAlerts.length + maintenance.length + schedule.length}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        <button
          onClick={() => navigate("/labassistant/inventory")}
          className="p-6 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl shadow hover:opacity-90 transition"
        >
          <Boxes size={30} />
          <p className="mt-2 text-lg font-medium">Inventory</p>
        </button>

        <button
          onClick={() => navigate("/labassistant/maintenance")}
          className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-400 text-white rounded-xl shadow hover:opacity-90 transition"
        >
          <Wrench size={30} />
          <p className="mt-2 text-lg font-medium">Maintenance</p>
        </button>

        <button
          onClick={() => navigate("/labassistant/requests")}
          className="p-6 bg-gradient-to-br from-purple-600 to-purple-400 text-white rounded-xl shadow hover:opacity-90 transition"
        >
          <ClipboardList size={30} />
          <p className="mt-2 text-lg font-medium">Requests</p>
        </button>

        <button
          onClick={() => navigate("/labassistant/procurement")}
          className="p-6 bg-gradient-to-br from-green-600 to-green-400 text-white rounded-xl shadow hover:opacity-90 transition"
        >
          <Package size={30} />
          <p className="mt-2 text-lg font-medium">Procurement</p>
        </button>
      </div>

      {/* Today Schedule */}
      <div className="bg-white shadow rounded-lg p-5">
        <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
          <Calendar /> Today's Lab Sessions
        </h3>

        <div className="mt-4 space-y-3">
          {schedule.map((s) => (
            <div key={s.id} className="border rounded-lg p-4 hover:bg-blue-50 transition">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">{s.lab}</h4>
                <span className="text-blue-600 text-sm">{s.time}</span>
              </div>

              <p className="text-gray-600">{s.course}</p>

              <p className="text-sm text-gray-500">{s.students} students</p>
            </div>
          ))}

          {schedule.length === 0 && (
            <p className="text-gray-500 text-center py-4">No lab sessions today.</p>
          )}
        </div>
      </div>

      {/* Inventory Alerts */}
      <div className="bg-white shadow rounded-lg p-5">
        <h3 className="text-xl font-semibold text-red-600 flex items-center gap-2">
          <AlertTriangle /> Low Inventory Alerts
        </h3>

        <div className="mt-4 space-y-3">
          {inventoryAlerts.map((item) => (
            <div
              key={item.id}
              className="border border-red-300 bg-red-50 rounded-lg p-4 flex justify-between"
            >
              <div>
                <p className="font-semibold">{item.item}</p>
                <p className="text-sm text-gray-600">
                  Current: {item.current} • Minimum: {item.minimum}
                </p>
              </div>

              <button
                onClick={() => navigate("/labassistant/procurement")}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Reorder
              </button>
            </div>
          ))}

          {inventoryAlerts.length === 0 && (
            <p className="text-gray-500 text-center py-4">All inventory levels are healthy.</p>
          )}
        </div>
      </div>

      {/* Pending Maintenance */}
      <div className="bg-white shadow rounded-lg p-5">
        <h3 className="text-xl font-semibold text-yellow-600 flex items-center gap-2">
          <Wrench /> Pending Maintenance
        </h3>

        <div className="mt-4 space-y-3">
          {maintenance.map((m) => (
            <div
              key={m.id}
              className="border border-yellow-300 bg-yellow-50 rounded-lg p-4"
            >
              <p className="font-semibold text-gray-800">{m.equipmentName}</p>
              <p className="text-gray-600">{m.issue}</p>

              <span className="mt-2 inline-block px-3 py-1 rounded text-sm font-medium bg-yellow-500 text-white">
                {m.priority}
              </span>
            </div>
          ))}

          {maintenance.length === 0 && (
            <p className="text-gray-500 text-center py-4">No pending maintenance tasks.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabAssistantDashboard;
