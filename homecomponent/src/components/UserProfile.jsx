import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../lib/redux/store';
import { useGetCurrentUserProfileQuery } from '../services/api';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Backend එකෙන් complete profile data ගන්නවා
  const { data: profile, isLoading } = useGetCurrentUserProfileQuery(
    user?.registrationNumber || user?.username,
    { skip: !user?.registrationNumber && !user?.username } // user නැතිනම් API call එක skip කරනවා
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signup');
  };

  if (!user) return null;

  // Backend data loading වෙනකොට Redux data පෙන්වනවා
  const displayName = profile?.name || user.username;
  const displayEmail = profile?.email || user.email;
  const displayRole = profile?.role || user.role;

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="font-semibold">{displayName}</p>
        {displayEmail && (
          <p className="text-xs text-gray-400">{displayEmail}</p>
        )}
        <p className="text-sm text-gray-500">
          {displayRole?.replace('ROLE_', '') || 'User'}
        </p>
        {isLoading && (
          <p className="text-xs text-blue-500">Loading profile...</p>
        )}
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
