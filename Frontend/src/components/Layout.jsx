import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Layout.css'

const Layout = ({ children, menuItems, title = "🔬 Lab Assistant" }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    // Redirect to homecomponent sign in page
    navigate('/')
  }

  // Get user initials for avatar
  const getInitials = (user) => {
    if (!user || !user.name) return "U";
    const name = user.name;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  // Get user from localStorage
  const getUserData = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        return JSON.parse(userStr)
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
    return { name: 'Lab Assistant', email: '' }
  }

  const user = getUserData()

  const defaultMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/requests', label: 'Requests', icon: '📋' },
    { path: '/procurement', label: 'Procurement', icon: '🛒' },
    { path: '/maintenance', label: 'Maintenance', icon: '🔧' },
    { path: '/reports', label: 'Reports', icon: '📄' }
  ]

  const itemsToRender = menuItems || defaultMenuItems;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-left">
            <h1 className="nav-title">{title}</h1>
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
          </div>
          <div className="nav-right">
            <div className="user-dropdown">
              <button
                className="user-dropdown-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar">
                  <span>{getInitials(user)}</span>
                </div>
                <span className="user-name-display">{user.name}</span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-role">{title}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </button>
                  <button className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">⚙️</span>
                    Settings
                  </button>
                  <button className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">❓</span>
                    Help & Support
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="layout-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <ul className="sidebar-menu">
            {itemsToRender.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''
                    }`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout


