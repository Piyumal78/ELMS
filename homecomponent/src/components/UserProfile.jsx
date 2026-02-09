import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../lib/redux/store';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signup');
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="font-semibold">{user.username}</p>
        <p className="text-sm text-gray-500">
          {user.role === 'student' ? 'Student' : user.staffRole || 'Staff'}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
