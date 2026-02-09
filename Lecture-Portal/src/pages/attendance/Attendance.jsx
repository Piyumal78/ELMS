import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/navbar.jsx'
import { AttendanceService, LabSessionService } from '../../services/api'
 


const Attendance = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendance, setAttendance] = useState([]);
   
  const [attendanceLoading, setAttendanceLoading] = useState(false);
 
  // Fetch lab sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await LabSessionService.getAll();
        setSessions(data);
        if (data.length > 0) {
          setSelectedSession(data[0]);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setAttendanceLoading(false);
      }
    };
    fetchSessions();
  }, []);
 
  // Fetch attendance when session changes
  useEffect(() => {
    if (selectedSession) {
      fetchAttendance(selectedSession.id);
    }
  }, [selectedSession]);
 
  const fetchAttendance = async (sessionId) => {
    setAttendanceLoading(true);
    try {
      const data = await AttendanceService.getBySession(sessionId);
      setAttendance(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setAttendanceLoading(false);
    }
  };
 
  // Handle mark attendance
  const handleMarkAttendance = async (studentId, newStatus) => {
    try {
      await AttendanceService.markAttendance(selectedSession.id, studentId, newStatus);
      // Update local state
      setAttendance(attendance.map(a => 
        a.id === studentId ? { ...a, status: newStatus } : a
      ));
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };
 
  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-700 border-green-200';
      case 'Absent': return 'bg-red-100 text-red-700 border-red-200';
      case 'Late': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
 
  // Calculate attendance stats
  const getStats = () => {
    const present = attendance.filter(a => a.status === 'Present').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;
    const late = attendance.filter(a => a.status === 'Late').length;
    return { present, absent, late, total: attendance.length };
  };
 
  const stats = getStats();
 
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <Sidebar />
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Attendance Tracking</h1>
            <p className="text-gray-500 mt-1">Track and manage student attendance for lab sessions</p>
          </div>
 
          {/* Session Selector */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Lab Session</label>
            <select
              value={selectedSession?.id || ''}
              onChange={(e) => {
                const session = sessions.find(s => s.id === parseInt(e.target.value));
                setSelectedSession(session);
              }}
              className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title} - {session.date} ({session.startTime})
                </option>
              ))}
            </select>
          </div>
 
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                  <p className="text-sm text-gray-500">Total Students</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                  
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                  <p className="text-sm text-gray-500">Present</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
                  
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                  <p className="text-sm text-gray-500">Absent</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                  
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
                  <p className="text-sm text-gray-500">Late</p>
                </div>
              </div>
            </div>
          </div>
 
          {/* Attendance Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedSession ? `${selectedSession.title} - Attendance List` : 'Select a Session'}
              </h3>
            </div>
            
            {attendanceLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {record.studentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-gray-800">{record.studentName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{record.visibleId}</td>
                        <td className="px-6 py-4 text-gray-600">{record.checkInTime}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleMarkAttendance(record.id, 'Present')}
                              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                record.status === 'Present' 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleMarkAttendance(record.id, 'Absent')}
                              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                record.status === 'Absent' 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-red-50 text-red-600 hover:bg-red-100'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleMarkAttendance(record.id, 'Late')}
                              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                record.status === 'Late' 
                                  ? 'bg-orange-500 text-white' 
                                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                              }`}
                            >
                              Late
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
 
            {attendance.length === 0 && !attendanceLoading && (
              <div className="p-8 text-center text-gray-500">
                No attendance records found for this session
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default Attendance
 
