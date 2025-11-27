
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, user }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { label: 'Manage Users', icon: '👥', path: '/dashboard/admin/users' },
        { label: 'Manage Subjects', icon: '📚', path: '/dashboard/admin/subjects' },
        { label: 'Students', icon: '🎓', path: '/dashboard/admin/students' },
        { label: 'Announcements', icon: '📢', path: '/dashboard/admin/announcements' },
        { label: 'Public Info', icon: '🌐', path: '/dashboard/admin/public-info' },
      ];
    } else if (user?.role === 'teacher') {
  return [
    ...baseItems,
    { label: 'Take Attendance', icon: '✅', path: '/dashboard/teacher/attendance' },
    { label: 'View Attendance', icon: '📊', path: '/dashboard/teacher/attendance-view' },
    { label: 'Results', icon: '📝', path: '/dashboard/teacher/results' },
    { label: 'Create Subject', icon: '📚', path: '/dashboard/teacher/subject-create' },
    { label: 'Assign Results', icon: '🎯', path: '/dashboard/teacher/assign-result' },
    { label: 'Pending Requests', icon: '⏳', path: '/dashboard/teacher/pending-requests' },
  ];
} else if (user?.role === 'student') {
  return [
    ...baseItems,
    { label: 'Announcements', icon: '📢', path: '/dashboard/student/announcements' },
    { label: 'Public Info', icon: '🌐', path: '/dashboard/student/public-info' },
    { label: 'View Attendance', icon: '✅', path: '/dashboard/student/view-attendance' },
    { label: 'View Results', icon: '📝', path: '/dashboard/student/view-results' },
    { label: 'Class Request', icon: '📚', path: '/dashboard/student/class-request' },
    { label: 'Mark Attendance', icon: '✏️', path: '/dashboard/student/mark-attendance' },
  ];
}

    return baseItems;
  };

  const handleNavClick = (path) => {
   
    navigate(path);
    
  
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">
            <span style={{ color: '#0db4b9' }}>Edu</span>
            <span style={{ color: '#e76d89' }}>Manage</span>
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="user-info">
          <div className="user-avatar" style={{ backgroundColor: '#e76d89' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h4>{user?.name || 'User'}</h4>
            <span className="user-role">{user?.role || 'Role'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {getMenuItems().map((item, index) => (
              <li key={index}>
                <button 
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.path)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
          
          
          <div className="sidebar-footer">
            <button 
              className="logout-sidebar-btn" 
              onClick={handleLogout}
            >
              <span className="nav-icon">🚪</span>
              <span className="nav-label">Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;