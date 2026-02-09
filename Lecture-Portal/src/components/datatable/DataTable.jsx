import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
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
        // This will call API when connected to Spring Boot
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
        // Remove from local state after successful delete
        setStudents(students.filter((student) => student.id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };
 
  // Column definitions for DataGrid
  const columns = [
    { field: 'studentId', headerName: 'Student ID', width: 100 },
    { 
      field: 'fullName', 
      headerName: 'Full Name', 
      width: 180,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
            {params.row.firstName?.charAt(0)}{params.row.lastName?.charAt(0)}
          </div>
          <span>{params.row.firstName} {params.row.lastName}</span>
        </div>
      ),
    },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'course', headerName: 'Course', width: 150 },
    { field: 'year', headerName: 'Year', width: 100 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100,
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          params.row.status === 'Active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {params.row.status}
        </span>
      ),
    },
  ];
 
  // Action column
  const actionColumn = [
    {
      field: 'action',
      headerName: 'Action',
      width: 180,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Link to={`/students/${params.row.id}`}>
            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
              View
            </button>
          </Link>
          <button 
            onClick={() => handleDelete(params.row.id)}
            className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
 
  const paginationModel = { page: 0, pageSize: 5 };
 
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Students List</h2>
        <Link to="/students/new">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <span>+</span>
            Add New Student
          </button>
        </Link>
      </div>
 
      {/* DataGrid */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={students}
          columns={columns.concat(actionColumn)}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          loading={loading}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f3f4f6',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f9fafb',
              borderBottom: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f9fafb',
            },
          }}
        />
      </div>
    </div>
  )
}
 
export default DataTable
