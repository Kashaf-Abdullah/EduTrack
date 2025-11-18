import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const Attendance = () => {
  const { token, user } = useContext(AuthContext);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState('');

  // Fetch all subjects for this teacher
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Support both populated and non-populated teacher fields
        const mySubjects = res.data.filter(sub =>
          sub.teacher === user._id ||
          (sub.teacher && sub.teacher._id === user._id)
        );
        setSubjects(mySubjects);
      } catch (err) {
        setError('Failed to load subjects');
      }
    };
    if (token && user) fetchSubjects();
  }, [token, user]);

  // Fetch attendance for the selected subject
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedSubject) {
        setAttendanceRecords([]);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/attendance/subject/${selectedSubject}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
       // console.log("attendance"+res);
       console.log("attendance", JSON.stringify(res.data, null, 2));

        setAttendanceRecords(res.data);
      } catch (err) {
        setError('Failed to load attendance');
      }
    };
    if (token && selectedSubject) fetchAttendance();
  }, [selectedSubject, token]);

  return (
    <div>
      <h2>Attendance</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>
        Select Subject:
        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
        >
          <option value="">-- Select Subject --</option>
          {subjects.map(subject => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
      </label>

      {selectedSubject === '' ? (
        <p>Please select a subject.</p>
      ) : attendanceRecords.length === 0 ? (
        <p>No attendance records found for this subject.</p>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Class Code</th>
              <th>Student Name</th>
              <th>Present</th>
              <th>Sign In</th>
              <th>Sign Out</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map(session =>
              session.attendanceRecords.map(record => (
                <tr key={record._id}>
                  <td>{session.classDate ? new Date(session.classDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{session.classCode}</td>
                  <td>{record.student?.name || 'N/A'}</td>
                  <td>{record.present ? "Yes" : "No"}</td>
                  <td>
          {record.signInTime
            ? new Date(record.signInTime).toLocaleDateString() + ' ' + new Date(record.signInTime).toLocaleTimeString()
            : "N/A"}
        </td>
        <td>
          {record.signOutTime
            ? new Date(record.signOutTime).toLocaleDateString() + ' ' + new Date(record.signOutTime).toLocaleTimeString()
            : "N/A"}
        </td>
                      </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Attendance;
