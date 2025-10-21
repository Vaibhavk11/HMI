import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-blue-500 text-white shadow-lg">
      <div className="container-mobile flex items-center justify-between py-4">
        <Link to="/dashboard" className="text-xl font-bold flex items-center gap-2">
          <span>�</span>
          <span>Workout Tracker</span>
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                {user.displayName && (
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {user.displayName}
                  </span>
                )}
                <span className="text-xs opacity-80 truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
            </div>
            <button onClick={handleLogout} className="text-sm hover:underline">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
