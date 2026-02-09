import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/navbar.jsx'
import { SessionService, CourseService, LabSessionService } from '../../services/api'

const LabSessions = () => {
  const [searchParams] = useSearchParams();
  const courseCodeFromUrl = searchParams.get('course');

  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(courseCodeFromUrl || '');
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [newSession, setNewSession] = useState({
    experimentNumber: '',
    title: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  // Fetch courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await CourseService.getAll();
        setCourses(data);
        if (courseCodeFromUrl) {
          setSelectedCourse(courseCodeFromUrl);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    loadCourses();
  }, [courseCodeFromUrl]);

  // Fetch sessions when course changes
  useEffect(() => {
    if (selectedCourse) {
      fetchSessions(selectedCourse);
    } else {
      // Show mock data when no course selected
      fetchMockSessions();
    }
  }, [selectedCourse]);

  const fetchSessions = async (courseCode) => {
    try {
      setLoading(true);
      const data = await SessionService.getByCourseCode(courseCode);
      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMockSessions = async () => {
    try {
      setLoading(true);
      const data = await LabSessionService.getAll();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching mock sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setError('');

    // Get user ID from stored user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.lectureId || 1;

    try {
      await SessionService.create({
        ...newSession,
        courseCode: selectedCourse,
        userId
      });
      setSuccessMessage('Session created successfully!');
      setShowCreateModal(false);
      setNewSession({
        experimentNumber: '',
        title: '',
        date: '',
        startTime: '',
        endTime: ''
      });
      fetchSessions(selectedCourse);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create session');
    }
  };

  // Handle edit session (for mock data)
  const handleEdit = (session) => {
    setEditingSession({
      ...session,
      // Normalize fields between real and mock data
      id: session.sessionId || session.id,
      title: session.title,
      labRoom: session.labRoom || 'Lab A-101',
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      maxStudents: session.maxStudents || 30,
      status: session.status || 'Upcoming'
    });
    setShowModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await LabSessionService.update(editingSession.id, editingSession);
      setSessions(sessions.map(s => 
        (s.sessionId || s.id) === editingSession.id ? editingSession : s
      ));
      setShowModal(false);
      setEditingSession(null);
      setSuccessMessage('Session updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  // Handle delete session
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lab session?')) {
      try {
        await LabSessionService.delete(id);
        setSessions(sessions.filter(s => (s.sessionId || s.id) !== id));
        setSuccessMessage('Session deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch {
        console.error('Error deleting session');
      }
    }
  };

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'Completed': return 'bg-green-50 text-green-600 border border-green-200';
      case 'Full': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'Cancelled': return 'bg-red-50 text-red-600 border border-red-200';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
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
              <h1 className="text-2xl font-semibold text-gray-900">Lab Sessions</h1>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              disabled={!selectedCourse}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Session
            </button>
          </div>

          {/* Course Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
            >
              <option value="">-- All Sessions (Mock Data) --</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseCode}>
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>
            {!selectedCourse && (
              <p className="text-sm text-gray-500 mt-2">Select a course to view and create real lab sessions</p>
            )}
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

          {/* Sessions Grid */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <div key={session.sessionId || session.id} className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors overflow-hidden">
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {session.experimentNumber && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs font-medium rounded">
                              Exp {session.experimentNumber}
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 truncate">{session.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{session.labRoom || 'Lab Room TBA'}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getStatusStyle(session.status)}`}>
                        {session.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{session.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{session.startTime} - {session.endTime}</span>
                      </div>
                      {session.maxStudents && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1.5">
                              <span>Enrolled</span>
                              <span className="font-medium text-gray-900">{session.enrolled || 0}/{session.maxStudents}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full">
                              <div 
                                className="h-full bg-gray-900 rounded-full transition-all"
                                style={{ width: `${((session.enrolled || 0) / session.maxStudents) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-5 pt-5 border-t border-gray-100">
                      <button 
                        onClick={() => handleEdit(session)}
                        className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 hover:border-gray-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(session.sessionId || session.id)}
                        className="flex-1 px-3 py-2 text-gray-500 border border-gray-200 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sessions.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No Lab Sessions</h3>
              <p className="text-gray-500 mt-1">
                {selectedCourse 
                  ? 'Create your first lab session for this course' 
                  : 'Select a course to manage its sessions'}
              </p>
              {selectedCourse && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Create Session
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4 overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create New Session</h3>
            </div>
            <form onSubmit={handleCreateSession} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Experiment Number</label>
                    <input
                      type="number"
                      value={newSession.experimentNumber}
                      onChange={(e) => setNewSession({...newSession, experimentNumber: e.target.value})}
                      placeholder="1"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Course</label>
                    <input
                      type="text"
                      value={selectedCourse}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Session Title</label>
                  <input
                    type="text"
                    value={newSession.title}
                    onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                    placeholder="Introduction to Circuit Design"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time</label>
                    <input
                      type="time"
                      value={newSession.startTime}
                      onChange={(e) => setNewSession({...newSession, startTime: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">End Time</label>
                    <input
                      type="time"
                      value={newSession.endTime}
                      onChange={(e) => setNewSession({...newSession, endTime: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Create Session
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

      {/* Edit Modal */}
      {showModal && editingSession && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4 overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Lab Session</h3>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                  <input
                    type="text"
                    value={editingSession.title}
                    onChange={(e) => setEditingSession({...editingSession, title: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Lab Room</label>
                  <input
                    type="text"
                    value={editingSession.labRoom}
                    onChange={(e) => setEditingSession({...editingSession, labRoom: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                    <input
                      type="date"
                      value={editingSession.date}
                      onChange={(e) => setEditingSession({...editingSession, date: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Students</label>
                    <input
                      type="number"
                      value={editingSession.maxStudents}
                      onChange={(e) => setEditingSession({...editingSession, maxStudents: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    value={editingSession.status}
                    onChange={(e) => setEditingSession({...editingSession, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Full">Full</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingSession(null); }}
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

export default LabSessions