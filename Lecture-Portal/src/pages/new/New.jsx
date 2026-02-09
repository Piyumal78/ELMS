import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/navbar.jsx'
import { StudentService, LabSessionService } from '../../services/api'
 
const New = ({ inputs, title }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
 
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
 
  // Handle file change for image upload
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
 
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
 
    try {
      let response;
      
      // Determine which API to call based on title
      if (title.includes('Student')) {
        response = await StudentService.create(formData);
      } else if (title.includes('Lab Session')) {
        response = await LabSessionService.create(formData);
      }
 
      if (response.success) {
        setMessage({ type: 'success', text: response.message });
        // Navigate back after success
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      console.error('Create error:', error);
    } finally {
      setLoading(false);
    }
  };
 
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-500 mt-1">Fill in the details below</p>
          </div>
 
          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              {/* Message Display */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}
 
              <div className="flex gap-8">
                {/* Left - Image Upload */}
                <div className="w-48">
                  <div className="w-48 h-48 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
                    {file ? (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <span className="text-4xl text-gray-400 mb-2">📷</span>
                        <span className="text-sm text-gray-500">No image</span>
                      </>
                    )}
                  </div>
                  <label className="mt-4 block">
                    <span className="w-full inline-block text-center py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                      Upload Image
                    </span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                  </label>
                </div>
 
                {/* Right - Form Fields */}
                <div className="flex-1">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {inputs && inputs.map((input) => (
                        <div key={input.id} className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-2">
                            {input.label}
                          </label>
                          <input
                            type={input.type}
                            name={input.label.toLowerCase().replace(/\s+/g, '')}
                            placeholder={input.placeholder}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            required
                          />
                        </div>
                      ))}
                    </div>
 
                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Creating...' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default New
