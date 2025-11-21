import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const ViewAttendance = () => {
  const { token, user } = useContext(AuthContext);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !user) return;
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/attendance/student/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendanceRecords(response.data);
        setError('');
      } catch {
        setError('Failed to fetch attendance');
      }
    };
    fetchAttendance();
  }, [token, user]);

  return (
    <div>
      <h2>Your Attendance</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {attendanceRecords.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Class Date</th>
              <th>Present</th>
              <th>Sign In Time</th>
              <th>Sign Out Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) =>
              record.attendanceRecords.map((att) => (
                <tr key={att._id}>
                  <td>{record.subject?.name || 'N/A'}</td>
                  <td>{new Date(record.classDate).toLocaleDateString()}</td>
                  <td>{att.present ? 'Yes' : 'No'}</td>
                  <td>{att.signInTime ? new Date(att.signInTime).toLocaleString() : 'N/A'}</td>
                  <td>{att.signOutTime ? new Date(att.signOutTime).toLocaleString() : 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAttendance;
