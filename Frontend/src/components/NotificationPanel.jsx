import React, { useState, useEffect } from 'react'
import { notificationsAPI } from '../utils/api'
import './NotificationPanel.css'
import { IoIosNotifications, IoIosClose, IoIosTrash, IoIosRefresh } from "react-icons/io";

const NotificationPanel = ({ role = 'LAB_ASSISTANT' }) => {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Poll every 10 seconds for "near real-time" feel
    const interval = setInterval(fetchNotifications, 10000)
    return () => clearInterval(interval)
  }, [role])

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getUnread(role)
      setNotifications(response.data)
    } catch (error) {
      console.error('Error fetching notifications')
    }
  }

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id)
      // Optimistic update
      setNotifications(notifications.filter(n => n.id !== id))
    } catch (error) {
      console.error('Error marking as read')
    }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationsAPI.delete(id)
      setNotifications(notifications.filter(n => n.id !== id))
    } catch (error) {
      console.error('Error deleting notification')
    }
  }

  return (
    <div className="notification-panel">
      <div className="bell-icon" onClick={() => setIsOpen(!isOpen)}>
        <IoIosNotifications />

        {notifications.length > 0 && (
          <span className="badge">{notifications.length}</span>
        )}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="header-actions">
              <button className="refresh-btn" onClick={fetchNotifications} title="Refresh">
                <IoIosRefresh />
              </button>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <IoIosClose />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notif">No new notifications</p>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className="notification-item">
                  <div className="notif-content-wrapper">
                    <div className="notif-title">{notif.title}</div>
                    <div className="notif-message">{notif.message}</div>
                    <div className="notif-time">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="notif-actions">
                    <button
                      className="mark-read-btn"
                      onClick={() => markAsRead(notif.id)}
                      title="Mark as Read"
                    >
                      ✓
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteNotification(notif.id)}
                      title="Delete"
                      style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                    >
                      <IoIosTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationPanel
