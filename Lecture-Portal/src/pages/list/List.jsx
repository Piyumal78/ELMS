import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { StudentService } from '../../services/api';

const DataTable = () => {
  // State for students data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students data on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await StudentService.getAll();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Handle delete student
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await StudentService.delete(id);
        setStudents(students.filter((student) => student.id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-base font-medium text-gray-900">All Students</h2>
        <Link to="/lecturer/students/new">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Student
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
              <th className="px-6 py-3 text-left">Student ID</th>
              <th className="px-6 py-3 text-left">Full Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Course</th>
              <th className="px-6 py-3 text-left">Year</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No students found</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-700">{student.studentId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-medium">
                        {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                      </div>
                      <span className="text-gray-900">{student.firstName} {student.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{student.email}</td>
                  <td className="px-6 py-4 text-gray-700">{student.course}</td>
                  <td className="px-6 py-4 text-gray-700">{student.year}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                      student.status === 'Active'
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/lecturer/students/${student.id}`}>
                        <button className="px-3 py-1.5 text-gray-600 border border-gray-200 rounded-md text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors">
                          View
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="px-3 py-1.5 text-gray-500 border border-gray-200 rounded-md text-xs font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
