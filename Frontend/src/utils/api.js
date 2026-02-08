import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/elms/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (data) => api.post('/register', data) // optional
}

// Inventory API (Mapped to ComponentController)
export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`)
}

// Requests API
export const requestsAPI = {
  getAll: () => api.get('/requests'),
  getById: (id) => api.get(`/requests/${id}`),
  approve: (id) => api.put(`/requests/${id}/approve`),
  reject: (id) => api.put(`/requests/${id}/reject`),
  issue: (id) => api.put(`/requests/${id}/issue`),
  return: (id, isDamaged) => api.put(`/requests/${id}/return`, null, { params: { isDamaged } }),
  create: (data) => api.post('/requests', data)
}

// Procurement API (Placeholder - Backend Controller Missing)
export const procurementAPI = {
  getAll: () => api.get('/requests?type=PROCUREMENT'), // Tentative mapping
  create: (data) => api.post('/requests', { ...data, type: 'PROCUREMENT' }),
  getById: (id) => api.get(`/requests/${id}`),
  approve: (id) => api.put(`/requests/${id}/approve`),
  reject: (id) => api.put(`/requests/${id}/reject`),
  receive: (id) => api.put(`/requests/${id}/receive`)
}

// Maintenance API (Placeholder - Backend Controller Missing)
export const maintenanceAPI = {
  getAll: () => api.get('/requests?type=MAINTENANCE'), // Tentative mapping
  create: (data) => api.post('/requests', { ...data, type: 'MAINTENANCE' }),
  updateStatus: (id, status) => api.put(`/requests/${id}/status`, { status }),
  getById: (id) => api.get(`/requests/${id}`)
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats')
}

// Notifications API
export const notificationsAPI = {
  getUnread: (role) => api.get(`/notifications/unread/${role}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  delete: (id) => api.delete(`/notifications/${id}`)
}

// Lab Manual API (For simulation)
export const labManualAPI = {
  upload: (data) => api.post('/manuals/upload', data)
}

export default api

