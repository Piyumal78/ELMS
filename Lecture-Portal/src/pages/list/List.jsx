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

  // Column definitions for DataGrid
  const columns = [
    { field: 'studentId', headerName: 'Student ID', width: 100 },
    { 
      field: 'fullName', 
      headerName: 'Full Name', 
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-medium">
            {params.row.firstName?.charAt(0)}{params.row.lastName?.charAt(0)}
          </div>
          <span className="text-gray-900">{params.row.firstName} {params.row.lastName}</span>
        </div>
      ),
    },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'course', headerName: 'Course', width: 150 },
    { field: 'year', headerName: 'Year', width: 100 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100,
      renderCell: (params) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
          params.row.status === 'Active' 
            ? 'bg-green-50 text-green-600 border border-green-200' 
            : 'bg-red-50 text-red-600 border border-red-200'
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
            <button className="px-3 py-1.5 text-gray-600 border border-gray-200 rounded-md text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors">
              View
            </button>
          </Link>
          <button 
            onClick={() => handleDelete(params.row.id)}
            className="px-3 py-1.5 text-gray-500 border border-gray-200 rounded-md text-xs font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-base font-medium text-gray-900">All Students</h2>
        <Link to="/students/new">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Student
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
            fontFamily: 'inherit',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f3f4f6',
              fontSize: '14px',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '12px',
              fontWeight: '500',
              textTransform: 'uppercase',
              color: '#6b7280',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f9fafb',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e5e7eb',
            },
            '& .MuiCheckbox-root': {
              color: '#d1d5db',
            },
            '& .MuiCheckbox-root.Mui-checked': {
              color: '#111827',
            },
          }}
        />
      </div>
    </div>
  )
}

export default DataTable