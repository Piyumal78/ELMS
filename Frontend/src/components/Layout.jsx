import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Layout.css'

const Layout = ({ children, menuItems }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
          <h1 className="nav-title">🔬 Lab Assistant</h1>
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
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


