
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/navbar.jsx'
import { StudentService } from '../../services/api'
 
const Single = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // Fetch student details
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // This will call API when connected to Spring Boot
        const data = await StudentService.getById(studentId);
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [studentId]);
 
  // Handle delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await StudentService.delete(studentId);
        navigate('/students');
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };
 
  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex flex-1">
          <div className="w-64 bg-white border-r border-gray-200">
            <Sidebar />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }
 
  if (!student) {
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex flex-1">
          <div className="w-64 bg-white border-r border-gray-200">
            <Sidebar />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">Student Not Found</h2>
              <button 
                onClick={() => navigate('/students')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Back to Students
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <Navbar />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <Sidebar />
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Student Information</h1>
              <p className="text-gray-500 mt-1">View and manage student details</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  {/* Student Avatar */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                    {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {student.firstName} {student.lastName}
                  </h2>
                  <p className="text-gray-500">{student.studentId}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    student.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {student.status}
                  </span>
                </div>
 
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📧</span>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm text-gray-800">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📚</span>
                      <div>
                        <p className="text-xs text-gray-500">Course</p>
                        <p className="text-sm text-gray-800">{student.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎓</span>
                      <div>
                        <p className="text-xs text-gray-500">Year</p>
                        <p className="text-sm text-gray-800">{student.year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Right Column - Details & Statistics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Attendance Overview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">85%</p>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-gray-600">Sessions Attended</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">2</p>
                    <p className="text-sm text-gray-600">Sessions Missed</p>
                  </div>
                </div>
              </div>
 
              {/* Lab Performance */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Lab Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Circuit Design</span>
                      <span className="text-sm font-medium text-gray-800">88%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Digital Electronics</span>
                      <span className="text-sm font-medium text-gray-800">75%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Microprocessors</span>
                      <span className="text-sm font-medium text-gray-800">92%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
 
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Attended Circuit Design Lab</p>
                      <p className="text-xs text-gray-500">Feb 8, 2025 - 09:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      📝
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Submitted Lab Report #5</p>
                      <p className="text-xs text-gray-500">Feb 7, 2025 - 03:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default Single
 
