import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const AttendanceView = () => {
  const { user, token } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState('');

  // Fetch teacher classes on load
  useEffect(() => {
    if (!token || !user) return;
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const myClasses = response.data.filter(
          (cls) => cls.teacher === user.id || (cls.teacher && cls.teacher.id === user.id)
        );
        setClasses(myClasses);
      } catch {
        setError('Failed to load classes');
      }
    };
    fetchClasses();
  }, [token, user]);

  // Fetch attendance on class or date change
  useEffect(() => {
    if (!token || !user || !selectedClass) {
      setAttendanceRecords([]);
      return;
    }
    const fetchAttendance = async () => {
      try {
        const url = new URL(`http://localhost:5000/api/attendance/teacher/${user.id}`);
        url.searchParams.set('classId', selectedClass);
        if (selectedDate) url.searchParams.set('date', selectedDate);

        const response = await axios.get(url.toString(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendanceRecords(response.data);
        setError('');
      } catch {
        setError('Failed to fetch attendance');
      }
    };
    fetchAttendance();
  }, [selectedClass, selectedDate, token, user]);

  return (
    <div>
      <h2>Attendance Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>
        Select Class:
       <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
  <option value="">--Select Class--</option>
  {classes.map(cls => (
    <option key={cls._id} value={cls._id}>{cls.name}</option>
  ))}
</select>

      </label>

      <label style={{ marginLeft: '20px' }}>
        Select Date:
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
      </label>

      <h3>Attendance Records</h3>
      {attendanceRecords.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        attendanceRecords.map((record) => (
          <div key={record._id} style={{ marginBottom: '20px' }}>
            <h4>{record.subject?.name} on {new Date(record.classDate).toLocaleDateString()}</h4>
            <table border="1" cellPadding="6" cellSpacing="0" width="100%">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Sign In</th>
                  <th>Sign Out</th>
                  <th>Present</th>
                </tr>
              </thead>
              <tbody>
                {record.attendanceRecords.map((att) => (
                  <tr key={att.student?._id}>
                    <td>{att.student?.name || 'N/A'}</td>
                <td>
  {att.signInTime
    ? new Date(att.signInTime).toLocaleDateString() + ' ' + new Date(att.signInTime).toLocaleTimeString()
    : 'N/A'}
</td>
<td>
  {att.signOutTime
    ? new Date(att.signOutTime).toLocaleDateString() + ' ' + new Date(att.signOutTime).toLocaleTimeString()
    : 'N/A'}
</td>

                   <td>{att.present ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default AttendanceView;
