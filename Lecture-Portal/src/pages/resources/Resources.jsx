
import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/navbar.jsx'
import { ResourceService } from '../../services/api'
 
const Resources = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [materials, setMaterials] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', file: null });
 
  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const [materialsData, equipmentData] = await Promise.all([
        ResourceService.getMaterials(),
        ResourceService.getEquipment()
      ]);
      setMaterials(materialsData);
      setEquipment(equipmentData);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };
 
  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.title) return;
 
    try {
      await ResourceService.uploadMaterial(uploadData.file, uploadData.title);
      // Refresh materials list
      const updatedMaterials = await ResourceService.getMaterials();
      setMaterials(updatedMaterials);
      setShowUploadModal(false);
      setUploadData({ title: '', file: null });
    } catch (error) {
      console.error('Error uploading material:', error);
    }
  };
 
  // Handle delete material
  const handleDeleteMaterial = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await ResourceService.deleteMaterial(id);
        setMaterials(materials.filter(m => m.id !== id));
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };
 
  // Get equipment status style
  const getEquipmentStatusStyle = (status) => {
    switch (status) {
      case 'Good': return 'bg-green-100 text-green-700';
      case 'Maintenance': return 'bg-orange-100 text-orange-700';
      case 'Faulty': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
 
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
            <h1 className="text-2xl font-bold text-gray-800">Resources</h1>
            <p className="text-gray-500 mt-1">Manage lab materials and equipment inventory</p>
          </div>
 
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('materials')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'materials'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📄 Lab Materials (PDFs)
              </button>
              <button
                onClick={() => setActiveTab('equipment')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'equipment'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🔧 Equipment Inventory
              </button>
            </div>
          </div>
 
          {/* Materials Tab Content */}
          {activeTab === 'materials' && (
            <>
              {/* Upload Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <span>📤</span>
                  Upload Material
                </button>
              </div>
 
              {/* Materials Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                      <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materials.map((material) => (
                    <div key={material.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                          📕
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{material.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span>{material.type}</span>
                            <span>•</span>
                            <span>{material.size}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span>📅 {material.uploadDate}</span>
                            <span>•</span>
                            <span>⬇️ {material.downloads} downloads</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(material.id)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
 
              {materials.length === 0 && !loading && (
                <div className="text-center py-12 bg-white rounded-xl">
                  <span className="text-6xl">📄</span>
                  <h3 className="text-xl font-semibold text-gray-800 mt-4">No Materials Uploaded</h3>
                  <p className="text-gray-500 mt-2">Upload your first lab material to get started</p>
                </div>
              )}
            </>
          )}
 
          {/* Equipment Tab Content */}
          {activeTab === 'equipment' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Equipment Inventory</h3>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {equipment.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
                                🔧
                              </div>
                              <span className="font-medium text-gray-800">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{item.model}</td>
                          <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${item.available < item.quantity * 0.3 ? 'text-red-600' : 'text-green-600'}`}>
                                {item.available}
                              </span>
                              <div className="w-16 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className={`h-full rounded-full ${item.available < item.quantity * 0.3 ? 'bg-red-500' : 'bg-green-500'}`}
                                  style={{ width: `${(item.available / item.quantity) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEquipmentStatusStyle(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
 
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-indigo-600 text-white p-4">
              <h3 className="text-lg font-semibold">Upload Lab Material</h3>
            </div>
            <form onSubmit={handleUpload} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material Title</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    placeholder="e.g., Circuit Design Manual"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                      className="hidden"
                      id="fileInput"
                    />
                    <label htmlFor="fileInput" className="cursor-pointer">
                      <span className="text-4xl">📄</span>
                      <p className="mt-2 text-sm text-gray-600">
                        {uploadData.file ? uploadData.file.name : 'Click to select a PDF file'}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => { setShowUploadModal(false); setUploadData({ title: '', file: null }); }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
 
export default Resources
