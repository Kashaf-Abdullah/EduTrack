import React from 'react'
import ViewAttendance from './ViewAttendance';
import ViewResults from './ViewResults';
import ClassRequest from './ClassRequest';
import StudentAttendance from './StudentMarkAttendance';
import Announcement from './Announcement';
import PublicInfo from './PublicInfo';

const StudentDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
<h1>Student Dashboard</h1>
      {/* <button onClick={handleLogout} style={{ cursor: 'pointer', padding: '8px 16px' }}>
      Logout
      </button> */}
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
