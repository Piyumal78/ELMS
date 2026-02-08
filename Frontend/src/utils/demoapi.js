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

export const demoAPI = {
    // Session Management
    getSessionsByCourse: (courseCode) => api.get(`/sessions/courses/${courseCode}`),
    createSession: (data) => api.post('/sessions', data),

    // Lab Manuals
    uploadLabManual: (sessionId, formData) => api.post(`/lab-manuals/session/${sessionId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

    // Session Components
    getSessionComponents: (sessionId) => api.get(`/sessions/${sessionId}/session-components`),

    // Submissions
    getSubmissionsBySession: (sessionId) => api.get(`/submissions/session/${sessionId}`),

    // Mocked: Get Pending Reports (Since no backend endpoint exists for listing yet)
    getPendingReports: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { id: 1, studentName: "Kasun Perera", studentId: "S1234", experiment: "Ohm's Law", date: "2023-10-25", status: "PENDING" },
                        { id: 2, studentName: "Nimali Fernando", studentId: "S5678", experiment: "Kirchhoff's Laws", date: "2023-10-26", status: "PENDING" },
                        { id: 3, studentName: "Amara Silva", studentId: "S9012", experiment: "Diode Characteristics", date: "2023-10-27", status: "PENDING" }
                    ]
                })
            }, 500)
        })
    },

    // Submit Review
    reviewReport: (data) => api.post('/report-reviews', data)
}

export default api
