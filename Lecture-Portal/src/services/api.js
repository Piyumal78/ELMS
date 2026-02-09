// ============================================
// API Service Layer - Connected to ELMS Backend
// ============================================

const BASE_URL = 'http://localhost:8080/elms/api';

// ============================================
// AUTH HELPER - Uses token from shared login
// ============================================
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic fetch helper with error handling
const authFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return { success: true };
  }

  return response.json();
};

// ============================================
// LECTURER API
// ============================================
export const LecturerService = {
  getById: async (id) => {
    return authFetch(`${BASE_URL}/lecturers/${id}`);
  },

  getByRegistrationNumber: async (registrationNumber) => {
    return authFetch(`${BASE_URL}/lecturers/registration-number/${registrationNumber}`);
  },

  getAll: async () => {
    return authFetch(`${BASE_URL}/lecturers`);
  }
};

// ============================================
// COURSE API
// ============================================
export const CourseService = {
  create: async (courseData) => {
    return authFetch(`${BASE_URL}/courses`, {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  },

  getAll: async () => {
    return authFetch(`${BASE_URL}/courses/all`);
  },

  getById: async (courseId) => {
    return authFetch(`${BASE_URL}/courses/${courseId}`);
  },

  getByCourseCode: async (courseCode) => {
    return authFetch(`${BASE_URL}/courses/code/${courseCode}`);
  }
};

// ============================================
// SESSION API (Lab Sessions)
// ============================================
export const SessionService = {
  create: async (sessionData) => {
    return authFetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  },

  getByCourseCode: async (courseCode) => {
    return authFetch(`${BASE_URL}/sessions/courses/${courseCode}`);
  }
};

// ============================================
// ANNOUNCEMENT API
// ============================================
export const AnnouncementService = {
  create: async (announcementData) => {
    return authFetch(`${BASE_URL}/announcements`, {
      method: 'POST',
      body: JSON.stringify(announcementData)
    });
  },

  getByCourseId: async (courseId) => {
    return authFetch(`${BASE_URL}/courses/${courseId}/announcements`);
  },

  getById: async (id) => {
    return authFetch(`${BASE_URL}/announcements/${id}`);
  },

  update: async (id, announcementData) => {
    return authFetch(`${BASE_URL}/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData)
    });
  },

  delete: async (id) => {
    return authFetch(`${BASE_URL}/announcements/${id}`, {
      method: 'DELETE'
    });
  }
};

// ============================================
// LAB RESERVATION API
// ============================================
export const LabReservationService = {
  getPending: async () => {
    return authFetch(`${BASE_URL}/lab-reservations/pending`);
  },

  getApproved: async () => {
    return authFetch(`${BASE_URL}/lab-reservations/approved`);
  },

  getById: async (reservationId) => {
    return authFetch(`${BASE_URL}/lab-reservations/${reservationId}`);
  },

  getByDate: async (date) => {
    return authFetch(`${BASE_URL}/lab-reservations/date/${date}`);
  },

  approve: async (reservationId) => {
    return authFetch(`${BASE_URL}/lab-reservations/${reservationId}/approve`, {
      method: 'POST'
    });
  },

  reject: async (reservationId) => {
    return authFetch(`${BASE_URL}/lab-reservations/${reservationId}/reject`, {
      method: 'POST'
    });
  }
};

// ============================================
// COURSE ENROLLMENT API
// ============================================
export const EnrollmentService = {
  getByCourseId: async (courseId) => {
    return authFetch(`${BASE_URL}/enrollments/courses/${courseId}`);
  }
};

// ============================================
// LAB MANUAL API
// ============================================
export const LabManualService = {
  upload: async (sessionId, file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/lab-manuals/session/${sessionId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload lab manual');
    }
    return response.json();
  }
};

// ============================================
// DEMONSTRATOR API
// ============================================
export const DemonstratorService = {
  getAll: async () => {
    return authFetch(`${BASE_URL}/demonstrators`);
  },

  getById: async (id) => {
    return authFetch(`${BASE_URL}/demonstrators/${id}`);
  }
};

// ============================================
// SESSION COMPONENT API
// ============================================
export const SessionComponentService = {
  create: async (sessionId, data) => {
    return authFetch(`${BASE_URL}/sessions/${sessionId}/session-components`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getBySessionId: async (sessionId) => {
    return authFetch(`${BASE_URL}/sessions/${sessionId}/session-components`);
  },

  getAll: async () => {
    return authFetch(`${BASE_URL}/session-components`);
  }
};

// ============================================
// DASHBOARD SERVICE - Aggregated stats
// ============================================
export const DashboardService = {
  getStats: async () => {
    try {
      const [courses, pendingReservations] = await Promise.all([
        CourseService.getAll().catch(() => []),
        LabReservationService.getPending().catch(() => [])
      ]);

      return {
        totalCourses: courses.length || 0,
        pendingReservations: pendingReservations.length || 0,
        // These will need session counts per course
        activeSessions: 0,
        totalAnnouncements: 0
      };
    } catch {
      return {
        totalCourses: 0,
        pendingReservations: 0,
        activeSessions: 0,
        totalAnnouncements: 0
      };
    }
  }
};

// ============================================
// MOCK SERVICES - For pages without backend APIs
// ============================================

// Students - Kept for mock display (no backend API for lecturers)
export const StudentService = {
  getAll: async () => {
    return [
      { id: 1, studentId: 'STU001', firstName: 'Kasun', lastName: 'Perera', email: 'kasun@university.edu', course: 'BSc Electronics', year: '2nd Year', status: 'Active' },
      { id: 2, studentId: 'STU002', firstName: 'Nimal', lastName: 'Silva', email: 'nimal@university.edu', course: 'BSc Electronics', year: '2nd Year', status: 'Active' },
      { id: 3, studentId: 'STU003', firstName: 'Sanduni', lastName: 'Fernando', email: 'sanduni@university.edu', course: 'BSc Electronics', year: '3rd Year', status: 'Active' },
      { id: 4, studentId: 'STU004', firstName: 'Dilshan', lastName: 'Jayawardena', email: 'dilshan@university.edu', course: 'BSc Electronics', year: '1st Year', status: 'Inactive' },
      { id: 5, studentId: 'STU005', firstName: 'Sachini', lastName: 'Bandara', email: 'sachini@university.edu', course: 'BSc Electronics', year: '2nd Year', status: 'Active' },
    ];
  },

  getById: async (id) => {
    const students = await StudentService.getAll();
    return students.find(s => s.id === parseInt(id));
  },

  create: async (studentData) => {
    console.log('Creating student:', studentData);
    return { success: true, message: 'Student created successfully' };
  },

  update: async (id, studentData) => {
    console.log('Updating student:', id, studentData);
    return { success: true, message: 'Student updated successfully' };
  },

  delete: async (id) => {
    console.log('Deleting student:', id);
    return { success: true, message: 'Student deleted successfully' };
  }
};

// Lab Sessions - Legacy mock service (kept for backward compatibility)
export const LabSessionService = {
  getAll: async () => {
    return [
      { id: 1, title: 'Circuit Design Basics', labRoom: 'Lab A-101', date: '2025-02-10', startTime: '09:00', endTime: '11:00', maxStudents: 30, enrolled: 25, status: 'Upcoming' },
      { id: 2, title: 'Digital Electronics Lab', labRoom: 'Lab A-102', date: '2025-02-11', startTime: '14:00', endTime: '16:00', maxStudents: 25, enrolled: 25, status: 'Full' },
      { id: 3, title: 'Microprocessor Programming', labRoom: 'Lab B-201', date: '2025-02-12', startTime: '10:00', endTime: '12:00', maxStudents: 20, enrolled: 18, status: 'Upcoming' },
      { id: 4, title: 'Signal Processing', labRoom: 'Lab A-101', date: '2025-02-08', startTime: '09:00', endTime: '11:00', maxStudents: 30, enrolled: 28, status: 'Completed' },
    ];
  },

  getById: async (id) => {
    const sessions = await LabSessionService.getAll();
    return sessions.find(s => s.id === parseInt(id));
  },

  create: async (sessionData) => {
    console.log('Creating lab session:', sessionData);
    return { success: true, message: 'Lab session created successfully' };
  },

  update: async (id, sessionData) => {
    console.log('Updating lab session:', id, sessionData);
    return { success: true, message: 'Lab session updated successfully' };
  },

  delete: async (id) => {
    console.log('Deleting lab session:', id);
    return { success: true, message: 'Lab session deleted successfully' };
  }
};

// Attendance - Mock service (no backend API)
export const AttendanceService = {
  getBySession: async (sessionId) => {
    console.log('Fetching attendance for session:', sessionId);
    return [
      { id: 1, visibleId: 'STU001', studentName: 'Kasun Perera', status: 'Present', checkInTime: '09:05' },
      { id: 2, visibleId: 'STU002', studentName: 'Nimal Silva', status: 'Present', checkInTime: '09:02' },
      { id: 3, visibleId: 'STU003', studentName: 'Sanduni Fernando', status: 'Absent', checkInTime: '-' },
      { id: 4, visibleId: 'STU005', studentName: 'Sachini Bandara', status: 'Late', checkInTime: '09:25' },
    ];
  },

  markAttendance: async (sessionId, studentId, status) => {
    console.log('Marking attendance:', { sessionId, studentId, status });
    return { success: true };
  }
};

// Resources - Mock service (no backend API for lecturers)
export const ResourceService = {
  getMaterials: async () => {
    return [
      { id: 1, title: 'Circuit Design Manual', type: 'PDF', size: '2.5 MB', uploadDate: '2025-01-15', downloads: 45 },
      { id: 2, title: 'Lab Safety Guidelines', type: 'PDF', size: '1.2 MB', uploadDate: '2025-01-10', downloads: 120 },
      { id: 3, title: 'Microprocessor Reference', type: 'PDF', size: '5.8 MB', uploadDate: '2025-01-20', downloads: 32 },
    ];
  },

  uploadMaterial: async (file, title) => {
    console.log('Uploading material:', title, file);
    return { success: true, message: 'Material uploaded successfully' };
  },

  deleteMaterial: async (id) => {
    console.log('Deleting material:', id);
    return { success: true };
  },

  getEquipment: async () => {
    return [
      { id: 1, name: 'Oscilloscope', model: 'Tektronix TBS1052B', quantity: 15, available: 12, status: 'Good' },
      { id: 2, name: 'Multimeter', model: 'Fluke 117', quantity: 30, available: 28, status: 'Good' },
      { id: 3, name: 'Function Generator', model: 'Rigol DG1022', quantity: 10, available: 8, status: 'Good' },
      { id: 4, name: 'Power Supply', model: 'GW Instek GPS-3030D', quantity: 20, available: 15, status: 'Maintenance' },
      { id: 5, name: 'Soldering Station', model: 'Weller WE1010', quantity: 25, available: 22, status: 'Good' },
    ];
  },

  updateEquipment: async (id, data) => {
    console.log('Updating equipment:', id, data);
    return { success: true };
  }
};

// Auth Service - For logout (login handled by shared system)
export const AuthService = {
  login: async (username, password) => {
    // This calls the real backend login
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    return {
      success: true,
      token: data.token,
      user: { username, role: 'LECTURER' }
    };
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  // Kept for profile page mock
  updateProfile: async (profileData) => {
    console.log('Updating profile:', profileData);
    return { success: true, message: 'Profile updated successfully' };
  },

  changePassword: async (oldPassword, newPassword) => {
    console.log('Changing password', { oldPassword, newPassword });
    return { success: true, message: 'Password changed successfully' };
  }
};
