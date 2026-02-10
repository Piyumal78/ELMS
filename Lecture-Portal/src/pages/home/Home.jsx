import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/navbar.jsx'
import Widget from '../../components/widget.jsx'
import Table from '../../components/table/table.jsx'
import { CourseService, LabReservationService, SessionService } from '../../services/api'

const Home = () => {
  // State for dashboard stats
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeSessions: 0,
    pendingReservations: 0,
    totalAnnouncements: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all necessary data
        const [courses, pendingReservations] = await Promise.all([
          CourseService.getAll().catch(() => []),
          LabReservationService.getPending().catch(() => [])
        ]);

        // Get sessions for all courses
        let allSessions = [];
        for (const course of courses) {
          try {
            const sessions = await SessionService.getByCourseCode(course.courseCode);
            if (sessions) {
              allSessions = [...allSessions, ...sessions.map(s => ({
                ...s, 
                courseName: course.courseName,
                courseCode: course.courseCode
              }))];
            }
          } catch {
            // Ignore individual course errors
          }
        }

        setStats({
          totalCourses: courses.length || 0,
          activeSessions: allSessions.length || 0,
          pendingReservations: pendingReservations.length || 0,
          totalAnnouncements: 0 // Would need separate API call
        });

        // Get recent/upcoming sessions
        setRecentSessions(allSessions.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navbar at the top - full width */}
      <Navbar />
      
      {/* Main content area with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <Sidebar />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Page Header */}
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Overview</p>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Widget type="courses" count={stats.totalCourses} />
            <Widget type="sessions" count={stats.activeSessions} />
            <Widget type="reservations" count={stats.pendingReservations} />
            <Widget type="announcements" count={stats.totalAnnouncements} />
          </div>

          {/* Recent Sessions Section */}
          <div className="bg-white border border-gray-200 rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-base font-medium text-gray-900">Recent Lab Sessions</h2>
              <Link to="/labsessions" className="text-sm text-indigo-600 hover:text-indigo-700">
                View All →
              </Link>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-50 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">{session.experimentNumber || index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{session.title}</h4>
                        <p className="text-sm text-gray-500">{session.courseCode} • {session.courseName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{session.date}</p>
                        <p className="text-xs text-gray-500">{session.startTime} - {session.endTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No sessions found. Create a course and add sessions.</p>
                  <Link to="/courses" className="inline-block mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                    Create Course
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mt-8">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">Quick Actions</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quick Action Card 1 */}
              <Link to="/courses" className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-gray-700">Create Course</h4>
                    <p className="text-sm text-gray-500 mt-1">Add a new course</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Quick Action Card 2 */}
              <Link to="/announcements" className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-gray-700">Post Announcement</h4>
                    <p className="text-sm text-gray-500 mt-1">Notify your students</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Quick Action Card 3 */}
              <Link to="/reservations" className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-gray-700">Review Reservations</h4>
                    <p className="text-sm text-gray-500 mt-1">Approve lab requests</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home