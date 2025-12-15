// src/services/labAssistantService.ts
import axios from "axios";

const API_BASE = "http://localhost:5000/api/labassistant"; // Replace with your backend URL

// ------------------- Inventory -------------------
export interface InventoryItem {
  id: number;
  name: string;
  current: number;
  minimum: number;
  location?: string;
}

export const getInventory = async (): Promise<InventoryItem[]> => {
  const res = await axios.get<InventoryItem[]>(`${API_BASE}/inventory`);
  return res.data as InventoryItem[];
};

export const getInventoryAlerts = async (): Promise<InventoryItem[]> => {
  const res = await axios.get<InventoryItem[]>(`${API_BASE}/inventory/alerts`);
  return res.data as InventoryItem[];
};

// ------------------- Requests -------------------
export interface RequestItem {
  id: number;
  requestedBy: string;
  itemName: string;
  quantity: number;
  dateRequested: string;
  status: string; // Pending, Approved, Issued, Returned, Rejected
}

export const getRequests = async (): Promise<RequestItem[]> => {
  const res = await axios.get<RequestItem[]>(`${API_BASE}/requests`);
  return res.data as RequestItem[];
};

export const approveRequest = async (id: number) => {
  await axios.patch(`${API_BASE}/requests/${id}/approve`);
};

export const rejectRequest = async (id: number) => {
  await axios.patch(`${API_BASE}/requests/${id}/reject`);
};

export const markIssued = async (id: number) => {
  await axios.patch(`${API_BASE}/requests/${id}/issued`);
};

export const markReturned = async (id: number) => {
  await axios.patch(`${API_BASE}/requests/${id}/returned`);
};

// ------------------- Procurement -------------------
export interface ProcurementItem {
  id: number;
  itemName: string;
  quantityNeeded: number;
  status: string; // Pending, Approved, Delivered
}

export const getProcurements = async (): Promise<ProcurementItem[]> => {
  const res = await axios.get<ProcurementItem[]>(`${API_BASE}/procurement`);
  return res.data as ProcurementItem[];
};

export const createProcurement = async (payload: { itemName: string; quantityNeeded: number; }) => {
  await axios.post(`${API_BASE}/procurement`, payload);
};

// ------------------- Maintenance -------------------
export interface MaintenanceRecord {
  id: number;
  equipmentName: string;
  maintenanceType: string;
  scheduledDate: string;
  status: string; // Scheduled, Completed, Overdue
  nextMaintenanceDate?: string;
}

export const getMaintenanceRecords = async (): Promise<MaintenanceRecord[]> => {
  const res = await axios.get<MaintenanceRecord[]>(`${API_BASE}/maintenance`);
  return res.data;
};

export const createMaintenanceRecord = async (payload: { equipmentName: string; maintenanceType: string; scheduledDate: string; }) => {
  await axios.post(`${API_BASE}/maintenance`, payload);
};

export const getPendingMaintenance = async (): Promise<MaintenanceRecord[]> => {
  const res = await axios.get<MaintenanceRecord[]>(`${API_BASE}/maintenance/pending`);
  return res.data;
};

// ------------------- Dashboard / Today Schedule -------------------
export interface LabSchedule {
  id: number;
  lab: string;
  course: string;
  students: number;
  time: string;
}

export const getTodaySchedule = async (): Promise<LabSchedule[]> => {
  const res = await axios.get<LabSchedule[]>(`${API_BASE}/schedule/today`);
  return res.data;
};
