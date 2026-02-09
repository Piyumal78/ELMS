// src/services/labAssistantService.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api/labassistant"; // Replace with your backend URL

// ------------------- Dashboard -------------------

export const getDashboardStats = async () => {
  const res = await axios.get(`${API_BASE}/dashboard/stats`);
  return res.data;
};

// ------------------- Inventory -------------------

export const getInventory = async () => {
  const res = await axios.get(`${API_BASE}/inventory`);
  return res.data;
};

export const getInventoryAlerts = async () => {
  const res = await axios.get(`${API_BASE}/inventory/alerts`);
  return res.data;
};

// ------------------- Requests -------------------

export const getRequests = async () => {
  const res = await axios.get(`${API_BASE}/requests`);
  return res.data;
};

export const approveRequest = async (id) => {
  await axios.patch(`${API_BASE}/requests/${id}/approve`);
};

export const rejectRequest = async (id) => {
  await axios.patch(`${API_BASE}/requests/${id}/reject`);
};

export const markIssued = async (id) => {
  await axios.patch(`${API_BASE}/requests/${id}/issued`);
};

export const markReturned = async (id) => {
  await axios.patch(`${API_BASE}/requests/${id}/returned`);
};

// ------------------- Procurement -------------------

export const getProcurements = async () => {
  const res = await axios.get(`${API_BASE}/procurement`);
  return res.data;
};

export const createProcurement = async (payload) => {
  await axios.post(`${API_BASE}/procurement`, payload);
};

// ------------------- Maintenance -------------------

export const getMaintenanceRecords = async () => {
  const res = await axios.get(`${API_BASE}/maintenance`);
  return res.data;
};

export const createMaintenanceRecord = async (payload) => {
  await axios.post(`${API_BASE}/maintenance`, payload);
};

export const getPendingMaintenance = async () => {
  const res = await axios.get(`${API_BASE}/maintenance/pending`);
  return res.data;
};

// ------------------- Dashboard / Today Schedule -------------------

export const getTodaySchedule = async () => {
  const res = await axios.get(`${API_BASE}/schedule/today`);
  return res.data;
};
