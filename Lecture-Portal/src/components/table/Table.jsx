import React, { useState, useEffect } from 'react'
import { LabSessionService } from '../../services/api'
 
const Table = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
 
  // Fetch recent lab sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await LabSessionService.getAll();
        // Get only the 5 most recent sessions
        setSessions(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);
 
  // Get status badge styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Full':
        return 'bg-orange-100 text-orange-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
 
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Lab Sessions</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
              <th className="pb-3 font-medium">Session Title</th>
              <th className="pb-3 font-medium">Lab Room</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Time</th>
              <th className="pb-3 font-medium">Enrolled</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-lg">
                      
                    </div>
                    <span className="font-medium text-gray-800">{session.title}</span>
                  </div>
                </td>
                <td className="py-4 text-gray-600">{session.labRoom}</td>
                <td className="py-4 text-gray-600">{session.date}</td>
                <td className="py-4 text-gray-600">{session.startTime} - {session.endTime}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(session.enrolled / session.maxStudents) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{session.enrolled}/{session.maxStudents}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(session.status)}`}>
                    {session.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {sessions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No lab sessions found
        </div>
      )}
    </div>
  )
}
 
export default Table
