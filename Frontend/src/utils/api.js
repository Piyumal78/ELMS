import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/elms/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Inventory API
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
  return: (id, isDamaged) => api.put(`/requests/${id}/return`, { isDamaged }),
  create: (data) => api.post('/requests', data)
}

// Procurement API
export const procurementAPI = {
  getAll: () => api.get('/procurement'),
  create: (data) => api.post('/procurement', data),
  getById: (id) => api.get(`/procurement/${id}`),
  approve: (id) => api.put(`/procurement/${id}/approve`),
  reject: (id) => api.put(`/procurement/${id}/reject`),
  receive: (id) => api.put(`/procurement/${id}/receive`)
}

// Maintenance API
export const maintenanceAPI = {
  getAll: () => api.get('/maintenance'),
  create: (data) => api.post('/maintenance', data),
  updateStatus: (id, status) => api.put(`/maintenance/${id}/status`, { status }),
  getById: (id) => api.get(`/maintenance/${id}`)
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

