import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import NotificationDropdown from '../Notifications/NotificationDropdown';
import './Navbar.css';

const Navbar = ({ onMenuClick, user }) => {
  const { logout, restoreAdmin, isImpersonating } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const handleRestoreAdmin = () => {
    restoreAdmin();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick}>
          ☰
        </button>
        <h1 className="navbar-title">Dashboard</h1>
      </div>
      
      <div className="navbar-right">
        {/* Notification Bell */}
        <NotificationDropdown />

        {isImpersonating && (
          <button
            onClick={handleRestoreAdmin}
            style={{
              marginRight: '0.75rem',
              border: 'none',
              borderRadius: '999px',
              padding: '0.5rem 0.9rem',
              backgroundColor: '#1d1145',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ↩ Back to Admin
          </button>
        )}

        <div className="user-menu">
          <span className="welcome-text">
            {isImpersonating ? `Impersonating ${user?.name}` : `Welcome, ${user?.name}`}
          </span>
          <div className="dropdown">
            <button className="user-btn">
              <div className="user-avatar-sm" style={{ backgroundColor: '#e76d89' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </button>
            <div className="dropdown-content">
              <span className="user-email">{user?.email}</span>
              <span className="user-role-badge">{user?.role}</span>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;