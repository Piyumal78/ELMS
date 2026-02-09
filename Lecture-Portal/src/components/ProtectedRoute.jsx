import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ========================================
// DEV MODE BYPASS - SET TO false FOR REAL LOGIN
// ========================================
const DEV_MODE_BYPASS = true;  // Change to false to require login
// ========================================

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Skip authentication check in dev mode
  if (DEV_MODE_BYPASS) {
    return children;
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;
