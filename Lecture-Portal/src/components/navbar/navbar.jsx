import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    logout();
  };

  // Get user display info
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'L';
  };

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.name) {
      return user.name;
    }
    return 'Lecturer';
  };

  return (
    <nav className="bg-[#0f172a] border-b border-slate-700">
      <div className="px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        
          {/* Left Side - Title */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-white tracking-tight">
              E-Lab Portal
            </Link>
            <span className="ml-3 px-2 py-0.5 bg-slate-700 text-slate-300 text-xs font-medium rounded">
              LECTURER
            </span>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses, sessions..."
                className="w-full px-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-slate-500 focus:bg-slate-700 transition-colors text-slate-200 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right Side - Profile */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Settings */}
            <Link 
              to="/profile" 
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-slate-800 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {getUserInitials()}
                </div>
                <span className="text-sm font-medium text-slate-200 hidden sm:block">
                  {getUserName()}
                </span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-medium text-white">{getUserName()}</p>
                  <p className="text-xs text-slate-400">{user?.registrationNumber || 'Lecturer'}</p>
                </div>
                <Link to="/profile" className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700">
                  My Profile
                </Link>
                <Link to="/courses" className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700">
                  My Courses
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 rounded-b-lg border-t border-slate-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar