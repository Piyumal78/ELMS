import React, { useState, useEffect } from 'react'
import { procurementAPI } from '../utils/api'
import './ProcurementPage.css'

const ProcurementPage = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState('all') // all, pending, approved, delivered

  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    priority: 'Medium',
    notes: ''
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await procurementAPI.getAll()
      setRequests(response.data)
    } catch (error) {
      console.error('Error fetching procurement requests:', error)
      // Mock data for development
      // setRequests([
      // {
      //   id: 1,
      //   itemName: '10k Resistor',
      //   quantity: 50,
      //   priority: 'High',
      //   status: 'Pending',
      //   requestDate: '2024-01-15',
      //   notes: 'Stock is very low'
      // },
      //   {
      //     id: 2,
      //     itemName: 'Arduino Uno',
      //     quantity: 20,
      //     priority: 'Medium',
      //     status: 'Approved',
      //     requestDate: '2024-01-10',
      //     notes: 'Regular restocking'
      //   },
      //   {
      //     id: 3,
      //     itemName: 'Temperature Sensor',
      //     quantity: 30,
      //     priority: 'Low',
      //     status: 'Delivered',
      //     requestDate: '2024-01-05',
      //     notes: 'For upcoming projects'
      //   }
      // ])
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setFormData({
      itemName: '',
      quantity: '',
      priority: 'Medium',
      notes: ''
    })
    setShowAddModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity)
      }
      await procurementAPI.create(payload)
      setShowAddModal(false)
      fetchRequests()
    } catch (error) {
      console.error('Error creating procurement request:', error)
      const errorMsg = error.response?.data || 'Error creating procurement request. Please try again.';
      alert(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
  }

  const handleApprove = async (id) => {
    try {
      await procurementAPI.approve(id)
      fetchRequests()
    } catch (error) {
      console.error('Error approving request:', error)
      const status = error.response?.status;
      const data = error.response?.data;
      const errorMsg = data || `Error approving request (Status: ${status}). Please try again.`;
      alert(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
  }

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        await procurementAPI.reject(id)
        fetchRequests()
      } catch (error) {
        console.error('Error rejecting request:', error)
        const errorMsg = error.response?.data || 'Error rejecting request. Please try again.';
        alert(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
      }
    }
  }

  const handleReceive = async (id) => {
    if (window.confirm('Mark this item as received? This will update the inventory.')) {
      try {
        await procurementAPI.receive(id)
        fetchRequests()
      } catch (error) {
        console.error('Error marking received:', error)
        const errorMsg = error.response?.data || 'Error marking received. Please try again.';
        alert(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
      }
    }
  }

  const getStatusActions = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'pending') {
      return ['approve', 'reject']
    } else if (statusLower === 'approved') {
      return ['receive']
    }
    return []
  }

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true
    return req.status.toLowerCase() === filter.toLowerCase()
  })

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b'
      case 'approved': return '#10b981'
      case 'delivered': return '#3b82f6'
      case 'rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return <div className="page-loading">Loading procurement requests...</div>
  }

  return (
    <div className="procurement-page">
      <div className="page-header">
        <div>
          <h1>Procurement Requests</h1>
          <p>Request restocking of items from Admin</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          + Create Request
        </button>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Requests
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({requests.filter(r => r.status.toLowerCase() === 'pending').length})
        </button>
        <button
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved ({requests.filter(r => r.status.toLowerCase() === 'approved').length})
        </button>
        <button
          className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
          onClick={() => setFilter('delivered')}
        >
          Delivered ({requests.filter(r => r.status.toLowerCase() === 'delivered').length})
        </button>
      </div>

      <div className="procurement-table-container">
        <table className="procurement-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Item Name</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Quantity</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Priority</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Request Date</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  No procurement requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>
                    <strong>{request.itemName}</strong>
                    {request.notes && <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{request.notes}</div>}
                  </td>
                  <td style={{ padding: '12px' }}>{request.quantity}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      className="priority-badge"
                      style={{
                        backgroundColor: `${getPriorityColor(request.priority)}20`,
                        color: getPriorityColor(request.priority),
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {request.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: `${getStatusColor(request.status)}20`,
                        color: getStatusColor(request.status),
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(request.requestDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {getStatusActions(request.status).includes('approve') && (
                        <button
                          onClick={() => handleApprove(request.id)}
                          style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Approve
                        </button>
                      )}
                      {getStatusActions(request.status).includes('reject') && (
                        <button
                          onClick={() => handleReject(request.id)}
                          style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      )}
                      {getStatusActions(request.status).includes('receive') && (
                        <button
                          onClick={() => handleReceive(request.id)}
                          style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Received
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Procurement Request</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="procurement-form">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  required
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="e.g., 10k Resistor"
                />
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 50"
                />
              </div>

              <div className="form-group">
                <label>Priority *</label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="4"
                  placeholder="Additional information about this request..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProcurementPage


