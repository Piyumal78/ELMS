import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI, labManualAPI } from '../utils/api'
import NotificationPanel from '../components/NotificationPanel'
import './LabAssistantDashboard.css'
import { IoIosCube, IoIosWarning, IoIosClipboard, IoIosConstruct } from "react-icons/io";

const LabAssistantDashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    pendingRequests: 0,
    itemsUnderMaintenance: 0,
    todaySessions: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(() => {
      fetchStats(true) // Silent refresh
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchStats = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const response = await dashboardAPI.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Keep existing stats if refresh fails, or show error? 
      // For now, if it's first load and fails, we might want to keep mock or show empty.
      // But user said "stats are hardcoded... no caching" implying they dislike the mock.
      // We will ONLY fallback if stats are empty (first load).
      if (!stats.totalItems && !silent) {
        // Basic fallback 0s or keep mocks but mark them? 
        // User specifically hated the hardcoded default. 
        // Let's NOT set hardcoded defaults unless absolutely necessary for UI structure.
        // We'll leave the initial state (0s).
      }
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: <IoIosCube />,
      color: '#667eea',
      link: '/inventory'
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockCount,
      icon: <IoIosWarning />,
      color: '#f59e0b',
      link: '/inventory',
      urgent: stats.lowStockCount > 0
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: <IoIosClipboard />,
      color: '#10b981',
      link: '/requests',
      urgent: stats.pendingRequests > 0
    },
    {
      title: 'Under Maintenance',
      value: stats.itemsUnderMaintenance,
      icon: <IoIosConstruct />,
      color: '#ef4444',
      link: '/maintenance'
    }
  ]

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Lab Assistant Dashboard</h1>
          <p>Overview of your lab management system</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Simulation button for demo purposes */}
          <button
            onClick={async () => {
              const today = new Date().toISOString().split('T')[0];
              await labManualAPI.upload({
                title: "Physics Lab 101 Manual",
                courseName: "Applied Physics",
                sessionDate: today,
                uploadedBy: "Dr. Smith"
              });
              alert("Simulated: Manual Uploaded for TODAY. Check notification bell!");
            }}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          >
            Simulate Upload (Today)
          </button>
          <NotificationPanel />
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`stat-card ${card.urgent ? 'urgent' : ''}`}
          >
            <div className="stat-card-icon" style={{ backgroundColor: `${card.color}20` }}>
              <span style={{ fontSize: '2rem' }}>{card.icon}</span>
            </div>
            <div className="stat-card-content">
              <h3>{card.title}</h3>
              <p className="stat-value" style={{ color: card.color }}>
                {card.value}
              </p>
              {card.urgent && (
                <span className="urgent-badge">Action Needed</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-section">
        <h2>Today's Lab Sessions</h2>
        <div className="sessions-list">
          {stats.todaySessions && stats.todaySessions.length > 0 ? (
            stats.todaySessions.map((session) => (
              <div key={session.id} className="session-card">
                <div className="session-time">
                  <span className="time-label">Time</span>
                  <span className="time-value">{session.startTime} - {session.endTime}</span>
                </div>
                <div className="session-info">
                  <h3>{session.moduleCode}</h3>
                  <p className="session-topic">{session.topic}</p>
                  <p className="session-lecturer">👤 {session.lecturerName}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-sessions">
              <p>No lab sessions scheduled for today.</p>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/inventory" className="action-btn">
            <span>📦</span>
            <span>Manage Inventory</span>
          </Link>
          <Link to="/requests" className="action-btn">
            <span>📋</span>
            <span>Review Requests</span>
          </Link>
          <Link to="/procurement" className="action-btn">
            <span>🛒</span>
            <span>Create Procurement Request</span>
          </Link>
          <Link to="/maintenance" className="action-btn">
            <span>🔧</span>
            <span>Update Equipment Status</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LabAssistantDashboard


