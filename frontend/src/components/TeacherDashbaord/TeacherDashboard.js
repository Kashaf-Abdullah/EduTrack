import React, { useContext } from 'react';
import Attendance from './Attendance';
import Results from './Results';
import SubjectCreate from './SubjectCreate';
import AssignResult from './AssignResult';
import { AuthContext } from '../../contexts/AuthContext';

import TeacherPendingRequests from './TeacherPendingRequests';
import AttendanceView from './AttendanceView';

const TeacherDashboard = () => {
   const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    // Optionally, redirect user to login or home page here
    // e.g., navigate('/login') if you use react-router
  }
  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <button onClick={handleLogout} style={{ cursor: 'pointer', padding: '8px 16px' }}>
      Logout
    </button>
      <Attendance />
      <AttendanceView/>
      <Results />
      <SubjectCreate/>
      <AssignResult/>
<TeacherPendingRequests/>
    </div>
  );
};

export default TeacherDashboard;
