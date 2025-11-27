


import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Attendance from './Attendance';
import Results from './Results';
import SubjectCreate from './SubjectCreate';
import AssignResult from './AssignResult';
import TeacherPendingRequests from './TeacherPendingRequests';
import AttendanceView from './AttendanceView';
import './TeacherDashboard.css';

// Teacher Main Dashboard Component
const TeacherMainDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p>Welcome back, {user?.name}! Manage your classes and students.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e76d89' }}>
            📚
          </div>
          <div className="stat-content">
            <h3>5</h3>
            <p>My Subjects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#0db4b9' }}>
            👥
          </div>
          <div className="stat-content">
            <h3>45</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#1d1145' }}>
            ✅
          </div>
          <div className="stat-content">
            <h3>12</h3>
            <p>Pending Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f2a1a1' }}>
            📝
          </div>
          <div className="stat-content">
            <h3>8</h3>
            <p>Assignments Due</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-column">
          <div className="content-card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn">Take Attendance</button>
              <button className="action-btn">Add Results</button>
              <button className="action-btn">Create Subject</button>
            </div>
          </div>
          <div className="content-card">
            <h2>Recent Activities</h2>
            <p>No recent activities</p>
          </div>
        </div>
        <div className="grid-column">
          <div className="content-card">
            <h2>My Subjects</h2>
            <ul className="subject-list">
              <li>Mathematics</li>
              <li>Physics</li>
              <li>Computer Science</li>
            </ul>
          </div>
          <div className="content-card">
            <h2>Upcoming Deadlines</h2>
            <p>No upcoming deadlines</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Teacher Dashboard Component with Router
const TeacherDashboard = () => {
  const location = useLocation();

  // Route-based content rendering
  const renderContent = () => {
    switch(location.pathname) {
      case '/dashboard/teacher/attendance':
        return <Attendance />;
      case '/dashboard/teacher/attendance-view':
        return <AttendanceView />;
      case '/dashboard/teacher/results':
        return <Results />;
      case '/dashboard/teacher/subject-create':
        return <SubjectCreate />;
      case '/dashboard/teacher/assign-result':
        return <AssignResult />;
      case '/dashboard/teacher/pending-requests':
        return <TeacherPendingRequests />;
      case '/dashboard/teacher':
      case '/dashboard':
      default:
        return <TeacherMainDashboard />;
    }
  };

  return (
    <div className="teacher-dashboard-container">
      {renderContent()}
    </div>
  );
};

export default TeacherDashboard;