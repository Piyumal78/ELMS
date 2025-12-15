import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI } from '../utils/api'
import './LabAssistantDashboard.css'

const LabAssistantDashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    pendingRequests: 0,
    itemsUnderMaintenance: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Use mock data for development
      setStats({
        totalItems: 150,
        lowStockCount: 8,
        pendingRequests: 5,
        itemsUnderMaintenance: 3
      })
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: '📦',
      color: '#667eea',
      link: '/inventory'
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockCount,
      icon: '⚠️',
      color: '#f59e0b',
      link: '/inventory',
      urgent: stats.lowStockCount > 0
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: '📋',
      color: '#10b981',
      link: '/requests',
      urgent: stats.pendingRequests > 0
    },
    {
      title: 'Under Maintenance',
      value: stats.itemsUnderMaintenance,
      icon: '🔧',
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
        <h1>Lab Assistant Dashboard</h1>
        <p>Overview of your lab management system</p>
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


