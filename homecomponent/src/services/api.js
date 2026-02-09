import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * ============================================
 * ELMS API - RTK Query Configuration
 * ============================================
 * 
 * This file contains all API endpoints for the ELMS (Electronics Lab Management System)
 * Uses RTK Query for efficient data fetching, caching, and state management
 * 
 * Base URL: http://localhost:8080/elms/api
 * Authentication: JWT Bearer token (automatically attached to requests)
 * 
 * Endpoint Categories:
 * - Authentication: Login, Account activation, User profile
 * - Students: Student registration and details
 * - Courses: Course management and information
 * - Sessions: Lab session scheduling
 * - Announcements: Course announcements
 * - Enrollments: Course enrollment management
 * - Lab Reservations: Lab booking system
 * - Submissions: Lab report submissions
 * - Reviews: Lab report feedback and grading
 */

// Base API configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/elms/api',
    prepareHeaders: (headers, { getState, endpoint }) => {
      // Automatically attach JWT token to all requests for authentication
      const token = getState().auth?.token || localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Special handling for file uploads - browser sets Content-Type with boundary automatically
      if (endpoint !== 'submitReport') {
        headers.set('Content-Type', 'application/json');
      }
      return headers;
    },
  }),
  
  // Cache tags for automatic data invalidation and refetching
  tagTypes: ['Student', 'Course', 'Session', 'Announcement', 'LabReservation', 'Submission', 'ReportReview'],
  endpoints: (builder) => ({
    // ============ Authentication Endpoints ============
    
    // User login - Authenticates user and returns JWT token
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        // Decode JWT token and extract user information from payload
        if (response.token) {
          try {
            const payload = JSON.parse(atob(response.token.split('.')[1]));
            return {
              token: response.token,
              user: {
                id: response.user?.id || response.userId,
                username: payload.sub,
                role: payload.roles?.[0]?.authority || 'ROLE_STUDENT',
                email: response.user?.email,
              }
            };
          } catch (e) {
            return response;
          }
        }
        return response;
      },
    }),
    
    // Activate user account - Registers new user with username and password
    activateAccount: builder.mutation({
      query: (credentials) => ({
        url: '/auth/activate',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Get current user profile - Fetches user details by registration number
    getCurrentUserProfile: builder.query({
      query: (registrationNumber) => `/users/profile?registrationNumber=${encodeURIComponent(registrationNumber)}`,
      providesTags: ['Student'],
    }),

    // ============ Student Endpoints ============
    
    // Create new student - Registers a new student in the system
    createStudent: builder.mutation({
      query: (studentData) => ({
        url: '/students',
        method: 'POST',
        body: studentData,
      }),
      invalidatesTags: ['Student'],
    }),
    
    // Get student by ID - Fetches student details using student ID
    getStudentById: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    // ============ Course Endpoints ============
    
    // Get all courses - Retrieves list of all available courses
    getCourses: builder.query({
      query: () => '/courses/all',
      providesTags: ['Course'],
    }),
    
    // Get course by ID - Fetches specific course details using course ID
    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    
    // Get course by course code - Fetches course details using course code (e.g., BECS 11431)
    getCourseByCourseCode: builder.query({
      query: (courseCode) => `/courses/code/${courseCode}`,
      providesTags: (result, error, courseCode) => [{ type: 'Course', courseCode }],
    }),

    // ============ Session (Lab Session) Endpoints ============
    
    // Get all sessions - Retrieves list of all lab sessions
    getSessions: builder.query({
      query: () => '/sessions',
      providesTags: ['Session'],
    }),
    
    // Get session by ID - Fetches specific lab session details
    getSessionById: builder.query({
      query: (id) => `/sessions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Session', id }],
    }),
    
    // Get sessions by course code - Fetches all lab sessions for a specific course
    getSessionByCourseCode: builder.query({
      query: (courseCode) => `/sessions/${courseCode}`,
      providesTags: (result, error, courseCode) => [{ type: 'Session', courseCode }],
    }),
    
    // Get lab manual by session ID - Downloads lab manual for a specific session
    getLabManualBySessionId: builder.query({
      query: (sessionId) => `/lab-manuals/session/${sessionId}`,
      providesTags: (result, error, sessionId) => [{ type: 'Session', id: `labManual-${sessionId}` }],
    }),

    // ============ Announcement Endpoints ============
    
    // Get announcements by course code - Fetches all announcements for a specific course
    getAnnouncementsByCourseCode: builder.query({
      query: (courseCode) => `/courses/code/${courseCode}/announcements`,
      providesTags: ['Announcement'],
    }),
    
    // Get announcements by course ID - Fetches all announcements using course ID
    getAnnouncementsByCourseId: builder.query({
      query: (courseId) => `/courses/${courseId}/announcements`,
      providesTags: ['Announcement'],
    }),

    // ============ Enrollment Endpoints ============
    
    // Create course enrollment - Enrolls a student in a course
    createCourseEnrollment: builder.mutation({
      query: (enrollmentData) => ({
        url: '/enrollments',
        method: 'POST',
        body: enrollmentData,
      }),
      invalidatesTags: ['Course'],
    }),
    
    // Get enrollments by student ID - Fetches all courses enrolled by a student
    getEnrollmentsByStudentId: builder.query({
      query: (studentId) => `/enrollments/students/${studentId}`,
      providesTags: (result, error, studentId) => [{ type: 'Course', studentId }],
    }),
    
    // Get specific enrollment - Checks if student is enrolled in a specific course
    getEnrollmentByStudentNumberAndCourseCode: builder.query({
      query: ({ studentNumber, courseCode }) => `/enrollments/search?studentNumber=${encodeURIComponent(studentNumber)}&courseCode=${encodeURIComponent(courseCode)}`,
      providesTags: (result, error, { studentNumber, courseCode }) => [{ type: 'Course', id: `${studentNumber}-${courseCode}` }],
    }),
    getSessionByCourseCode: builder.query({
      query: (courseCode) => `/sessions/${courseCode}`,
      providesTags: (result, error, courseCode) => [{ type: 'Session', courseCode }],
    }),
    // Lab Reservation endpoints
    createLabReservation: builder.mutation({
      query: (reservationData) => ({
        url: '/lab-reservations',
        method: 'POST',
        body: reservationData,
      }),
      invalidatesTags: ['LabReservation'],
    }),
    
    // Get all lab reservations - Fetches list of all lab bookings
    getLabReservations: builder.query({
      query: () => '/lab-reservations',
      providesTags: ['LabReservation'],
    }),

    getLabManualBySessionId: builder.query({
      query: (sessionId) => `/lab-manuals/session/${sessionId}`,
      providesTags: (result, error, sessionId) => [{ type: 'Session', id: `labManual-${sessionId}` }],
    }),
    getLabReservationsByStudentId: builder.query({
      query: (studentId) => `/lab-reservations/student/${studentId}`,
      providesTags: (result, error, studentId) => [{ type: 'LabReservation', studentId }],
    }),
    
    // Delete lab reservation - Cancels an existing lab booking
    deleteLabReservation: builder.mutation({
      query: (reservationId) => ({
        url: `/lab-reservations/${reservationId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LabReservation'],
    }),
    // Lab Reservation endpoints
    createLabReservation: builder.mutation({
      query: (reservationData) => ({
        url: '/lab-reservations',
        method: 'POST',
        body: reservationData,
      }),
      invalidatesTags: ['LabReservation'],
    }),
    // Report Submission endpoints
    submitReport: builder.mutation({
      query: ({ studentId, sessionId, formData }) => ({
        url: `/submissions/student/${studentId}/session/${sessionId}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Submission'],
    }),
    
    // Get submissions by student ID - Fetches all lab reports submitted by a student
    getSubmissionsByStudentId: builder.query({
      query: (studentId) => `/submissions/student/${studentId}`,
      providesTags: (result, error, studentId) => [{ type: 'Submission', studentId }],
    }),
    
    // Get submission by ID - Fetches specific lab report submission details
    getSubmissionById: builder.query({
      query: (submissionId) => `/submissions/${submissionId}`,
      providesTags: (result, error, submissionId) => [{ type: 'Submission', id: submissionId }],
    }),

    // ============ Report Review Endpoints ============
    
    // Get review by submission ID - Fetches feedback and grades for a specific submission
    getReportReviewBySubmissionId: builder.query({
      query: (submissionId) => `/report-reviews/submission/${submissionId}`,
      providesTags: (result, error, submissionId) => [{ type: 'ReportReview', submissionId }],
    }),
    
    // Get all reviews by student ID - Fetches all feedback and grades received by a student
    getReviewsByStudentId: builder.query({
      query: (studentId) => `/report-reviews/student/${studentId}`,
      providesTags: (result, error, studentId) => [{ type: 'ReportReview', studentId }],
    }),
  }),
});


/**
 * ============================================
 * Exported Hooks for Components
 * ============================================
 * 
 * Auto-generated React hooks for each endpoint
 * Usage examples:
 * 
 * Queries (GET):
 *   const { data, isLoading, error } = useGetCoursesQuery()
 * 
 * Mutations (POST/PUT/DELETE):
 *   const [login, { isLoading }] = useLoginMutation()
 *   login(credentials)
 */
export const {
  useLoginMutation,
  useActivateAccountMutation,
  useGetCurrentUserProfileQuery,
  useCreateStudentMutation,
  useGetStudentByIdQuery,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetSessionsQuery,
  useGetSessionByIdQuery,
  useGetSessionByCourseCodeQuery,
  useGetAnnouncementsByCourseCodeQuery,
  useGetAnnouncementsByCourseIdQuery,
  useCreateLabReservationMutation,
  useGetLabReservationsQuery,
  useSubmitReportMutation,
  useCreateCourseEnrollmentMutation,
  useGetCourseByCourseCodeQuery,
  useGetEnrollmentsByStudentIdQuery,
  useGetEnrollmentByStudentNumberAndCourseCodeQuery,
  useGetLabManualBySessionIdQuery,
  useGetLabReservationsByStudentIdQuery,
  useDeleteLabReservationMutation,
  useGetSubmissionsByStudentIdQuery,
  useGetSubmissionByIdQuery,
  useGetReportReviewBySubmissionIdQuery,
  useGetReviewsByStudentIdQuery,
} = api;