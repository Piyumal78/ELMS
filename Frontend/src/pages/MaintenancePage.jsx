import React, { useState, useEffect } from 'react'
import { maintenanceAPI } from '../utils/api'
import './MaintenancePage.css'
import { IoIosCheckmarkCircle, IoIosConstruct, IoIosCloseCircle, IoIosHelpCircle, IoMdClose } from "react-icons/io";

const MaintenancePage = () => {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, working, maintenance, damaged
  const [editingEquipment, setEditingEquipment] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('Working')
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    location: '',
    status: 'Working',
    serialNumber: ''
  })

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      const response = await maintenanceAPI.getAll()
      setEquipment(response.data)
    } catch (error) {
      console.error('Error fetching equipment:', error)
      // Mock data for development
      // setEquipment([
      //   {
      //     id: 1,
      //     name: 'Oscilloscope',
      //     model: 'Tektronix TBS1000',
      //     location: 'Lab A',
      //     status: 'Working',
      //     lastMaintenanceDate: '2024-01-01'
      //   },
      //   {
      //     id: 2,
      //     name: 'Power Supply',
      //     model: 'Keysight E3631A',
      //     location: 'Lab B',
      //     status: 'Under Maintenance',
      //     lastMaintenanceDate: '2023-12-15'
      //   },
      //   {
      //     id: 3,
      //     name: 'Multimeter',
      //     model: 'Fluke 87V',
      //     location: 'Lab A',
      //     status: 'Working',
      //     lastMaintenanceDate: '2024-01-10'
      //   },
      //   {
      //     id: 4,
      //     name: 'Function Generator',
      //     model: 'Rigol DG1022',
      //     location: 'Lab B',
      //     status: 'Damaged',
      //     lastMaintenanceDate: '2023-11-20'
      //   }
      // ])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (equip) => {
    setEditingEquipment(equip)
    setSelectedStatus(equip.status)
    setShowStatusModal(true)
  }

  const handleStatusUpdate = async () => {
    if (!editingEquipment) return

    try {
      await maintenanceAPI.updateStatus(editingEquipment.id, selectedStatus)
      setShowStatusModal(false)
      setEditingEquipment(null)
      fetchEquipment()
    } catch (error) {
      console.error('Error updating equipment status:', error)
      alert('Error updating equipment status. Please try again.')
    }
  }

  const handleAddEquipment = async (e) => {
    e.preventDefault()
    try {
      await maintenanceAPI.create(formData)
      setShowAddModal(false)
      setFormData({
        name: '',
        model: '',
        location: '',
        status: 'Working',
        serialNumber: ''
      })
      fetchEquipment()
    } catch (error) {
      console.error('Error adding equipment:', error)
      alert('Error adding equipment. Please try again.')
    }
  }

  const filteredEquipment = equipment.filter(eq => {
    if (filter === 'all') return true
    return eq.status.toLowerCase().replace(' ', '') === filter.toLowerCase().replace(' ', '')
  })

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'working': return '#10b981'
      case 'under maintenance': return '#f59e0b'
      case 'damaged': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'working': return <IoIosCheckmarkCircle />
      case 'under maintenance': return <IoIosConstruct />
      case 'damaged': return <IoIosCloseCircle />
      default: return <IoIosHelpCircle />
    }
  }

  if (loading) {
    return <div className="page-loading">Loading equipment...</div>
  }

  return (
    <div className="maintenance-page">
      <div className="page-header">
        <div>
          <h1>Equipment Maintenance</h1>
          <p>Manage equipment status and maintenance</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Equipment
        </button>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Equipment
        </button>
        <button
          className={`filter-btn ${filter === 'working' ? 'active' : ''}`}
          onClick={() => setFilter('working')}
        >
          Working ({equipment.filter(e => e.status.toLowerCase() === 'working').length})
        </button>
        <button
          className={`filter-btn ${filter === 'maintenance' ? 'active' : ''}`}
          onClick={() => setFilter('maintenance')}
        >
          Under Maintenance ({equipment.filter(e => e.status.toLowerCase() === 'under maintenance').length})
        </button>
        <button
          className={`filter-btn ${filter === 'damaged' ? 'active' : ''}`}
          onClick={() => setFilter('damaged')}
        >
          Damaged ({equipment.filter(e => e.status.toLowerCase() === 'damaged').length})
        </button>
      </div>

      <div className="equipment-table-container">
        <table className="equipment-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Equipment Name</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Model / Serial</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Location</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Last Maintenance</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  No equipment found
                </td>
              </tr>
            ) : (
              filteredEquipment.map((eq) => (
                <tr key={eq.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>
                    <strong>{eq.name}</strong>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div>{eq.model}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{eq.serialNumber}</div>
                  </td>
                  <td style={{ padding: '12px' }}>{eq.location}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      className="status-indicator"
                      style={{
                        backgroundColor: `${getStatusColor(eq.status)}20`,
                        color: getStatusColor(eq.status),
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {getStatusIcon(eq.status)} {eq.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {eq.lastMaintenanceDate ? new Date(eq.lastMaintenanceDate).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      className="btn-update-status"
                      onClick={() => handleStatusChange(eq)}
                      style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showStatusModal && editingEquipment && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Equipment Status</h2>
              <button
                className="modal-close"
                onClick={() => setShowStatusModal(false)}
              >
                <IoMdClose />
              </button>
            </div>
            <div className="status-modal-content">
              <div className="equipment-info">
                <h3>{editingEquipment.name}</h3>
                <p>{editingEquipment.model}</p>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="status-select"
                >
                  <option value="Working">Working</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleStatusUpdate}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Equipment</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <IoMdClose />
              </button>
            </div>
            <form onSubmit={handleAddEquipment}>
              <div className="form-group">
                <label>Equipment Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Digital Oscilloscope"
                />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g. TBS1000"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Lab A, Shelf 2"
                />
              </div>
              <div className="form-group">
                <label>Serial Number</label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="e.g. SN12345678"
                />
              </div>
              <div className="form-group">
                <label>Initial Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="status-select"
                >
                  <option value="Working">Working</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaintenancePage


