import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/navbar.jsx'
import { CourseService, SessionService, AnnouncementService } from '../../services/api'

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [newCourse, setNewCourse] = useState({
    courseCode: '',
    courseName: '',
    academicYear: '2024/2025',
    lecturerId: null
  });

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await CourseService.getAll();
      // Fetch session counts for each course
      const coursesWithStats = await Promise.all(
        data.map(async (course) => {
          try {
            const sessions = await SessionService.getByCourseCode(course.courseCode);
            const announcements = await AnnouncementService.getByCourseId(course.courseId);
            return {
              ...course,
              sessionCount: sessions?.length || 0,
              announcementCount: announcements?.length || 0
            };
          } catch {
            return { ...course, sessionCount: 0, announcementCount: 0 };
          }
        })
      );
      setCourses(coursesWithStats);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError('');
    
    // Get lecturer ID from stored user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const lecturerId = user.id || user.lectureId || 1;

    try {
      await CourseService.create({
        ...newCourse,
        lecturerId
      });
      setSuccessMessage('Course created successfully!');
      setShowCreateModal(false);
      setNewCourse({ courseCode: '', courseName: '', academicYear: '2024/2025', lecturerId: null });
      fetchCourses();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create course');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <Sidebar />
        </div>
        
        <div className="flex-1 overflow-y-auto p-8">
          {/* Page Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Management</p>
              <h1 className="text-2xl font-semibold text-gray-900">My Courses</h1>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Course
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                  <div className="h-5 bg-gray-100 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-50 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-50 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Courses Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course.courseId} className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors overflow-hidden">
                  {/* Card Header with gradient */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5">
                    <h3 className="font-semibold text-white text-lg">{course.courseCode}</h3>
                    <p className="text-indigo-100 text-sm mt-1">{course.courseName}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-semibold text-gray-900">{course.sessionCount}</p>
                        <p className="text-xs text-gray-500 mt-1">Sessions</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-semibold text-gray-900">{course.announcementCount}</p>
                        <p className="text-xs text-gray-500 mt-1">Announcements</p>
                      </div>
                    </div>

                    {/* Lecturer Info */}
                    {course.lecturer && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{course.lecturer.name}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <Link 
                        to={`/labsessions?course=${course.courseCode}`}
                        className="flex-1 px-3 py-2 bg-gray-900 text-white text-center rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        View Sessions
                      </Link>
                      <Link 
                        to={`/announcements?course=${course.courseId}`}
                        className="flex-1 px-3 py-2 text-gray-700 border border-gray-200 text-center rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Announcements
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && courses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No Courses Yet</h3>
              <p className="text-gray-500 mt-1">Create your first course to get started</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Create Course
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create New Course</h3>
            </div>
            <form onSubmit={handleCreateCourse} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Code</label>
                  <input
                    type="text"
                    value={newCourse.courseCode}
                    onChange={(e) => setNewCourse({...newCourse, courseCode: e.target.value.toUpperCase()})}
                    placeholder="BECS 31613"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: 4 letters + space + 5 digits (e.g., BECS 31613)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Name</label>
                  <input
                    type="text"
                    value={newCourse.courseName}
                    onChange={(e) => setNewCourse({...newCourse, courseName: e.target.value})}
                    placeholder="Electronic Systems Design"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Academic Year</label>
                  <select
                    value={newCourse.academicYear}
                    onChange={(e) => setNewCourse({...newCourse, academicYear: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                    <option value="2026/2027">2026/2027</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Create Course
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setError(''); }}
                  className="flex-1 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Courses
