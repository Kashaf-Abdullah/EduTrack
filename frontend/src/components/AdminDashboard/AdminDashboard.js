
import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import DashboardLayout from '../Layout/DashboardLayout';
import ManageUsers from './ManageUsers';
import ManageSubjects from './ManageSubjects';
import Announcements from './Announcements';
import StudentsList from './StudentsList';
import './AdminDashboard.css';
import PublicInfoAdmin from '../PublicInfo/PublicInfoAdmin';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}! Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e76d89' }}>
            👥
          </div>
          <div className="stat-content">
            <h3>24</h3>
            <p>Pending Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#0db4b9' }}>
            🎓
          </div>
          <div className="stat-content">
            <h3>156</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#1d1145' }}>
            📚
          </div>
          <div className="stat-content">
            <h3>42</h3>
            <p>Active Subjects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f2a1a1' }}>
            📢
          </div>
          <div className="stat-content">
            <h3>8</h3>
            <p>Announcements</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-column">
          <div className="content-card">
            <ManageUsers />
          </div>
          <div className="content-card">
            <StudentsList />
          </div>
        </div>
        <div className="grid-column">
          
                </div>
      </div>
    </div>
  );
};

export default AdminDashboard;