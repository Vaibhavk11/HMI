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
        <Link to="/" className="text-xl font-bold">
          📝 Notes
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm truncate max-w-[150px]">{user.email}</span>
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
