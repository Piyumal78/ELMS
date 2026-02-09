import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// Base API configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/elms/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from state or localStorage
      const token = getState().auth?.token || localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Student', 'Course', 'Session', 'Announcement', 'LabReservation'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        // Token එකෙන් role decode කරන්න
        if (response.token) {
          try {
            const payload = JSON.parse(atob(response.token.split('.')[1]));
            return {
              token: response.token,
              user: {
                username: payload.sub,
                role: payload.roles?.[0]?.authority || 'ROLE_STUDENT',
              }
            };
          } catch (e) {
            return response;
          }
        }
        return response;
      },
    }),
    activateAccount: builder.mutation({
      query: (credentials) => ({
        url: '/auth/activate',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Student endpoints
    createStudent: builder.mutation({
      query: (studentData) => ({
        url: '/students',
        method: 'POST',
        body: studentData,
      }),
      invalidatesTags: ['Student'],
    }),
    getStudentById: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    // Course endpoints
    getCourses: builder.query({
      query:() =>'/courses/all',
      providesTags: ['Course'],
    }),
    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    getCourseByCourseCode: builder.query({
      query: (courseCode) => `/courses/code/${courseCode}`,
      providesTags: (result, error, courseCode) => [{ type: 'Course', courseCode }],
    }),

    // Session endpoints
    getSessions: builder.query({
      query: () => '/sessions',
      providesTags: ['Session'],
    }),
    getSessionById: builder.query({
      query: (id) => `/sessions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Session', id }],
    }),

    // Announcement endpoints
    getAnnouncements: builder.query({
      query: () => '/announcements',
      providesTags: ['Announcement'],
    }),

    createCourseEnrollment: builder.mutation({
      query: (enrollmentData) => ({
        url: '/enrollments',
        method: 'POST',
        body: enrollmentData,
      }),
      invalidatesTags: ['Course'],
    }),
    getEnrollmentsByStudentId: builder.query({
      query: (studentId) => `/enrollments/students/${studentId}`,
      providesTags: (result, error, studentId) => [{ type: 'Course', studentId }],
    }),
    getEnrollmentByStudentNumberAndCourseCode: builder.query({
      query: ({ studentNumber, courseCode }) => `/enrollments/search?studentNumber=${encodeURIComponent(studentNumber)}&courseCode=${encodeURIComponent(courseCode)}`,
      providesTags: (result, error, { studentNumber, courseCode }) => [{ type: 'Course', id: `${studentNumber}-${courseCode}` }],
    }),
    getSessionByCourseCode: builder.query({
      query: (courseCode) => `/sessions/courses/${courseCode}`,
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
    getLabReservations: builder.query({
      query: () => '/lab-reservations',
      providesTags: ['LabReservation'],
    }),

    // Report Submission endpoints
    submitReport: builder.mutation({
      query: ({ studentId, sessionId, formData }) => ({
        url: `/submissions/student/${studentId}/session/${sessionId}`,
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});


// Export hooks for usage in components
export const {
  useLoginMutation,
  useActivateAccountMutation,
  useCreateStudentMutation,
  useGetStudentByIdQuery,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetSessionsQuery,
  useGetSessionByIdQuery,
  useGetSessionByCourseCodeQuery,
  useGetAnnouncementsQuery,
  useCreateLabReservationMutation,
  useGetLabReservationsQuery,
  useSubmitReportMutation,
  useCreateCourseEnrollmentMutation,
  useGetCourseByCourseCodeQuery,
  useGetEnrollmentsByStudentIdQuery,
  useGetEnrollmentByStudentNumberAndCourseCodeQuery,
} = api;
