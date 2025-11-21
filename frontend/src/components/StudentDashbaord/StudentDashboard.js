import React, { useContext }  from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import ViewAttendance from './ViewAttendance';
import ViewResults from './ViewResults';
import ClassRequest from './ClassRequest';
import StudentAttendance from './StudentMarkAttendance';
import Announcement from './Announcement';
import PublicInfo from './PublicInfo';

const StudentDashboard = () => {
      const { logout } = useContext(AuthContext);
    
      const handleLogout = () => {
        logout();
        // Optionally, redirect user to login or home page here
        // e.g., navigate('/login') if you use react-router
      }
  return (
    <div>
<h1>student Dashboard</h1>
      <button onClick={handleLogout} style={{ cursor: 'pointer', padding: '8px 16px' }}>
      Logout
      </button>
      <Announcement/>
<PublicInfo/>
      <ViewAttendance/>
      <ViewResults/>
      <ClassRequest/>
      <StudentAttendance/>

    </div>
  )
}

export default StudentDashboard
