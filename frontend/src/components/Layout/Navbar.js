import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = ({ onMenuClick, user }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
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
        <div className="user-menu">
          <span className="welcome-text">Welcome, {user?.name}</span>
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