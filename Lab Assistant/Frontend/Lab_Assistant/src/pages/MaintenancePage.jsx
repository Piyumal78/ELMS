import React, { useState, useEffect } from 'react'
import { maintenanceAPI } from '../utils/api'
import './MaintenancePage.css'

const MaintenancePage = () => {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, working, maintenance, damaged
  const [editingEquipment, setEditingEquipment] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('Working')

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
      setEquipment([
        {
          id: 1,
          name: 'Oscilloscope',
          model: 'Tektronix TBS1000',
          location: 'Lab A',
          status: 'Working',
          lastMaintenanceDate: '2024-01-01'
        },
        {
          id: 2,
          name: 'Power Supply',
          model: 'Keysight E3631A',
          location: 'Lab B',
          status: 'Under Maintenance',
          lastMaintenanceDate: '2023-12-15'
        },
        {
          id: 3,
          name: 'Multimeter',
          model: 'Fluke 87V',
          location: 'Lab A',
          status: 'Working',
          lastMaintenanceDate: '2024-01-10'
        },
        {
          id: 4,
          name: 'Function Generator',
          model: 'Rigol DG1022',
          location: 'Lab B',
          status: 'Damaged',
          lastMaintenanceDate: '2023-11-20'
        }
      ])
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
      case 'working': return '✅'
      case 'under maintenance': return '🔧'
      case 'damaged': return '❌'
      default: return '❓'
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

      <div className="equipment-grid">
        {filteredEquipment.length === 0 ? (
          <div className="empty-state">
            <p>No equipment found</p>
          </div>
        ) : (
          filteredEquipment.map((eq) => (
            <div key={eq.id} className="equipment-card">
              <div className="card-header">
                <div>
                  <h3>{eq.name}</h3>
                  <p className="equipment-model">{eq.model}</p>
                </div>
                <div
                  className="status-indicator"
                  style={{
                    backgroundColor: `${getStatusColor(eq.status)}20`,
                    color: getStatusColor(eq.status)
                  }}
                >
                  <span className="status-icon">{getStatusIcon(eq.status)}</span>
                  <span className="status-text">{eq.status}</span>
                </div>
              </div>

              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{eq.location}</span>
                </div>
                {eq.lastMaintenanceDate && (
                  <div className="info-row">
                    <span className="info-label">Last Maintenance:</span>
                    <span className="info-value">
                      {new Date(eq.lastMaintenanceDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {eq.serialNumber && (
                  <div className="info-row">
                    <span className="info-label">Serial Number:</span>
                    <span className="info-value">{eq.serialNumber}</span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button
                  className="btn-update-status"
                  onClick={() => handleStatusChange(eq)}
                >
                  Update Status
                </button>
              </div>
            </div>
          ))
        )}
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
                ×
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
    </div>
  )
}

export default MaintenancePage


