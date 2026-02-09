import React, { useState, useEffect } from 'react'
import { requestsAPI } from '../utils/api'
import './RequestsPage.css'

import { toast } from 'react-toastify';

const RequestsPage = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending') // pending, approved, issued, returned, rejected, all

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await requestsAPI.getAll()
      setRequests(response.data)
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await requestsAPI.approve(id)
      toast.success('Request approved successfully!');
      fetchRequests()
    } catch (error) {
      console.error('Error approving request:', error)
      // Extract specific error message from backend
      const errorMsg = error.response?.data?.message || 'Error approving request.';
      toast.error(errorMsg);
    }
  }

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        await requestsAPI.reject(id)
        toast.info('Request rejected.');
        fetchRequests()
      } catch (error) {
        console.error('Error rejecting request:', error)
        const errorMsg = error.response?.data?.message || 'Error rejecting request.';
        toast.error(errorMsg);
      }
    }
  }

  const handleIssue = async (id) => {
    if (window.confirm('Mark this item as issued to the student?')) {
      try {
        await requestsAPI.issue(id)
        toast.success('Item issued successfully!');
        fetchRequests()
      } catch (error) {
        console.error('Error issuing item:', error)
        const errorMsg = error.response?.data?.message || 'Error issuing item.';
        toast.error(errorMsg);
      }
    }
  }

  const handleReturn = async (id) => {
    if (window.confirm('Mark this item as returned?')) {
      const isDamaged = window.confirm('Is the returned item damaged? Click OK for DAMAGED, Cancel for GOOD CONDITION.');
      try {
        await requestsAPI.return(id, isDamaged)
        if (isDamaged) {
          toast.warn('Item returned (Marked as Damaged)');
        } else {
          toast.success('Item returned successfully!');
        }
        fetchRequests()
      } catch (error) {
        console.error('Error marking return:', error)
        const errorMsg = error.response?.data?.message || 'Error marking return.';
        toast.error(errorMsg);
      }
    }
  }

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true
    return req.status.toLowerCase() === filter.toLowerCase()
  })

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b'
      case 'approved': return '#10b981'
      case 'issued': return '#3b82f6'
      case 'returned': return '#6b7280'
      case 'rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusActions = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'pending') {
      return ['approve', 'reject']
    } else if (statusLower === 'approved') {
      return ['issue']
    } else if (statusLower === 'issued') {
      return ['return']
    }
    return []
  }

  if (loading) {
    return <div className="page-loading">Loading requests...</div>
  }

  return (
    <div className="requests-page">
      <div className="page-header">
        <div>
          <h1>Resource Requests</h1>
          <p>Manage borrow requests from students and lecturers</p>
        </div>
      </div>

      <div className="filter-bar">
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
          className={`filter-btn ${filter === 'issued' ? 'active' : ''}`}
          onClick={() => setFilter('issued')}
        >
          Issued ({requests.filter(r => r.status.toLowerCase() === 'issued').length})
        </button>
        <button
          className={`filter-btn ${filter === 'returned' ? 'active' : ''}`}
          onClick={() => setFilter('returned')}
        >
          Returned ({requests.filter(r => r.status.toLowerCase() === 'returned').length})
        </button>
        <button
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected ({requests.filter(r => r.status.toLowerCase() === 'rejected').length})
        </button>
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Requests
        </button>
      </div>

      <div className="requests-table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Student/Lecturer</th>
              <th>Student ID</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Purpose</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  No requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => {
                const actions = getStatusActions(request.status)
                return (
                  <tr key={request.id}>
                    <td>
                      <strong>{request.student?.fullName || request.studentName || 'Unknown'}</strong>
                    </td>
                    <td>{request.student?.studentId || request.studentId || 'N/A'}</td>
                    <td>{request.itemName || request.inventory?.name || 'Unknown Item'}</td>
                    <td>{request.quantity}</td>
                    <td className="purpose-cell">{request.purpose}</td>
                    <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: `${getStatusColor(request.status)}20`,
                          color: getStatusColor(request.status)
                        }}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {actions.includes('approve') && (
                          <button
                            className="btn-approve"
                            onClick={() => handleApprove(request.id)}
                          >
                            ✓ Approve
                          </button>
                        )}
                        {actions.includes('reject') && (
                          <button
                            className="btn-reject"
                            onClick={() => handleReject(request.id)}
                          >
                            ✗ Reject
                          </button>
                        )}
                        {actions.includes('issue') && (
                          <button
                            className="btn-issue"
                            onClick={() => handleIssue(request.id)}
                          >
                            📤 Issue
                          </button>
                        )}
                        {actions.includes('return') && (
                          <button
                            className="btn-return"
                            onClick={() => handleReturn(request.id)}
                          >
                            ↻ Return
                          </button>
                        )}
                        {actions.length === 0 && (
                          <span className="no-action">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RequestsPage


