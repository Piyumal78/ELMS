import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Protected Route - Token එක නැතිනම් login page එකට යවන්න
export const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

// Student Only Route - Student විතරක් access කරන්න පුළුවන්
export const StudentRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/signup" replace />;
  }

  // Backend එකෙන් ආපු ACTUAL role එක check කරනවා
  if (!user?.role?.includes('STUDENT')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Staff Only Route - Staff, Lecturer, Admin විතරක් access කරන්න පුළුවන්
export const StaffRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/signup" replace />;
  }

  // Backend එකෙන් ආපු ACTUAL role එක check කරනවා
  const isStaff = user?.role?.includes('STAFF') ||
    user?.role?.includes('LECTURER') ||
    user?.role?.includes('ADMIN') ||
    user?.role?.includes('DEMONSTRATOR') ||
    user?.role?.includes('LAB_ASSISTANT');

  if (!isStaff) {
    return <Navigate to="/student" replace />;
  }

  return children;
};

// Lecturer Only Route - Lecturer විතරක් access කරන්න පුළුවන්
export const LecturerRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/lecturer/login" replace />;
  }

  // Backend එකෙන් ආපු ACTUAL role එක check කරනවා
  if (!user?.role?.includes('LECTURER')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin Only Route - Admin විතරක් access කරන්න පුළුවන්
export const AdminRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/signup" replace />;
  }

  if (!user?.role?.includes('ADMIN')) {
    return <Navigate to="/" replace />;
  }

  return children;
};
