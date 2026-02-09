import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import CampaignIcon from '@mui/icons-material/Campaign';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Function to check if current path matches
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  // Get user display name
  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.name) {
      return user.name;
    }
    return 'Lecturer';
  };

  // Menu items configuration
  const menuItems = [
    { path: '/', icon: <DashboardIcon sx={{ fontSize: 20 }} />, label: 'Dashboard', section: 'MAIN' },
    { path: '/courses', icon: <SchoolIcon sx={{ fontSize: 20 }} />, label: 'Courses', section: 'MAIN' },
    { path: '/labsessions', icon: <ScienceIcon sx={{ fontSize: 20 }} />, label: 'Lab Sessions', section: 'MAIN' },
    { path: '/reservations', icon: <CalendarMonthIcon sx={{ fontSize: 20 }} />, label: 'Reservations', section: 'MAIN' },
    { path: '/announcements', icon: <CampaignIcon sx={{ fontSize: 20 }} />, label: 'Announcements', section: 'MAIN' },
    { path: '/students', icon: <PeopleIcon sx={{ fontSize: 20 }} />, label: 'Students', section: 'OTHER' },
    { path: '/attendance', icon: <EventNoteIcon sx={{ fontSize: 20 }} />, label: 'Attendance', section: 'OTHER' },
    { path: '/resources', icon: <FolderIcon sx={{ fontSize: 20 }} />, label: 'Resources', section: 'RESOURCES' },
    { path: '/profile', icon: <PersonIcon sx={{ fontSize: 20 }} />, label: 'Settings', section: 'USER' },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
    
      {/* Header */}
      <div className="px-6 py-8 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Welcome</p>
        <h3 className="text-base font-semibold text-gray-900">{getUserName()}</h3>
        <p className="text-sm text-gray-500">Lecturer</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        {/* MAIN Section */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4 px-2">
            Menu
          </p>
          <div className="space-y-1">
            {menuItems.filter(item => item.section === 'MAIN').map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={isActive(item.path) ? 'text-white' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* OTHER Section (Mock Data Pages) */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4 px-2">
            Other
          </p>
          <div className="space-y-1">
            {menuItems.filter(item => item.section === 'OTHER').map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={isActive(item.path) ? 'text-white' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
                <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Mock</span>
              </Link>
            ))}
          </div>
        </div>

        {/* RESOURCES Section */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4 px-2">
            Resources
          </p>
          <div className="space-y-1">
            {menuItems.filter(item => item.section === 'RESOURCES').map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={isActive(item.path) ? 'text-white' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* USER Section */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4 px-2">
            Account
          </p>
          <div className="space-y-1">
            {menuItems.filter(item => item.section === 'USER').map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={isActive(item.path) ? 'text-white' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 w-full"
        >
          <LogoutIcon sx={{ fontSize: 20 }} className="text-gray-400" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar