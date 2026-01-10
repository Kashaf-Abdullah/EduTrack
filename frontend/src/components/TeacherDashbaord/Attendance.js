// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const Attendance = () => {
//   const { token, user } = useContext(AuthContext);

//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [error, setError] = useState('');

//   // Fetch all subjects for this teacher
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const res = await axios.get('${API_BASE_URL}/subjects', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         // Support both populated and non-populated teacher fields
//         const mySubjects = res.data.filter(sub =>
//           sub.teacher === user._id ||
//           (sub.teacher && sub.teacher._id === user._id)
//         );
//         setSubjects(mySubjects);
//       } catch (err) {
//         setError('Failed to load subjects');
//       }
//     };
//     if (token && user) fetchSubjects();
//   }, [token, user]);

//   // Fetch attendance for the selected subject
//   useEffect(() => {
//     const fetchAttendance = async () => {
//       if (!selectedSubject) {
//         setAttendanceRecords([]);
//         return;
//       }
//       try {
//         const res = await axios.get(`${API_BASE_URL}/attendance/subject/${selectedSubject}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//        // console.log("attendance"+res);
//        console.log("attendance", JSON.stringify(res.data, null, 2));

//         setAttendanceRecords(res.data);
//       } catch (err) {
//         setError('Failed to load attendance');
//       }
//     };
//     if (token && selectedSubject) fetchAttendance();
//   }, [selectedSubject, token]);

//   return (
//     <div>
//       <h2>Attendance</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <label>
//         Select Subject:
//         <select
//           value={selectedSubject}
//           onChange={e => setSelectedSubject(e.target.value)}
//         >
//           <option value="">-- Select Subject --</option>
//           {subjects.map(subject => (
//             <option key={subject._id} value={subject._id}>
//               {subject.name}
//             </option>
//           ))}
//         </select>
//       </label>

//       {selectedSubject === '' ? (
//         <p>Please select a subject.</p>
//       ) : attendanceRecords.length === 0 ? (
//         <p>No attendance records found for this subject.</p>
//       ) : (
//         <table border="1" cellPadding="6" cellSpacing="0" style={{ marginTop: '10px' }}>
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Class Code</th>
//               <th>Student Name</th>
//               <th>Present</th>
//               <th>Sign In</th>
//               <th>Sign Out</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceRecords.map(session =>
//               session.attendanceRecords.map(record => (
//                 <tr key={record._id}>
//                   <td>{session.classDate ? new Date(session.classDate).toLocaleDateString() : 'N/A'}</td>
//                   <td>{session.classCode}</td>
//                   <td>{record.student?.name || 'N/A'}</td>
//                   <td>{record.present ? "Yes" : "No"}</td>
//                   <td>
//           {record.signInTime
//             ? new Date(record.signInTime).toLocaleDateString() + ' ' + new Date(record.signInTime).toLocaleTimeString()
//             : "N/A"}
//         </td>
//         <td>
//           {record.signOutTime
//             ? new Date(record.signOutTime).toLocaleDateString() + ' ' + new Date(record.signOutTime).toLocaleTimeString()
//             : "N/A"}
//         </td>
//                       </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Attendance;


import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const Attendance = () => {
  const { token, user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedClassCode, setSelectedClassCode] = useState('all');

  // Fetch all subjects for this teacher
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get('${API_BASE_URL}/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Support both populated and non-populated teacher fields
        const mySubjects = res.data.filter(sub =>
          sub.teacher === user._id ||
          (sub.teacher && sub.teacher._id === user._id)
        );
        setSubjects(mySubjects);
        setError('');
      } catch (err) {
        setError('Failed to load subjects');
      } finally {
        setLoading(false);
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
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/attendance/subject/${selectedSubject}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("attendance", JSON.stringify(res.data, null, 2));
        setAttendanceRecords(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load attendance records');
      } finally {
        setLoading(false);
      }
    };
    if (token && selectedSubject) fetchAttendance();
  }, [selectedSubject, token]);

  // Get unique class codes and dates for filtering
  const classCodes = [...new Set(attendanceRecords.map(record => record.classCode))];
  const dates = [...new Set(attendanceRecords.map(record => 
    record.classDate ? new Date(record.classDate).toISOString().split('T')[0] : ''
  ))].filter(date => date);

  // Filter records based on selected filters
  const filteredRecords = attendanceRecords.filter(record => {
    const dateMatch = !selectedDate || 
      (record.classDate && new Date(record.classDate).toISOString().split('T')[0] === selectedDate);
    const classCodeMatch = selectedClassCode === 'all' || record.classCode === selectedClassCode;
    return dateMatch && classCodeMatch;
  });

  // Calculate statistics
  const totalSessions = filteredRecords.length;
  const totalStudents = filteredRecords.reduce((total, session) => 
    total + (session.attendanceRecords?.length || 0), 0
  );
  const presentStudents = filteredRecords.reduce((total, session) => 
    total + (session.attendanceRecords?.filter(record => record.present)?.length || 0), 0
  );
  const attendanceRate = totalStudents > 0 ? ((presentStudents / totalStudents) * 100).toFixed(1) : 0;

  const refreshData = async () => {
    if (!selectedSubject) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/attendance/subject/${selectedSubject}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceRecords(res.data);
      setSuccess('Attendance data refreshed successfully!');
      setError('');
    } catch (err) {
      setError('Failed to refresh attendance data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (record) => {
    if (!record.present) {
      return { text: 'Absent', color: 'var(--error)' };
    }
    if (record.signInTime && !record.signOutTime) {
      return { text: 'Present (Active)', color: 'var(--success)' };
    }
    if (record.signInTime && record.signOutTime) {
      return { text: 'Present (Completed)', color: 'var(--info)' };
    }
    return { text: 'Marked Present', color: 'var(--warning)' };
  };

  const getDuration = (signInTime, signOutTime) => {
    if (!signInTime) return 'N/A';
    if (!signOutTime) return 'Still present';
    
    const signIn = new Date(signInTime);
    const signOut = new Date(signOutTime);
    const diffMs = signOut - signIn;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div 
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}
              >
                <span style={{ color: 'white', fontSize: '1.5rem' }}>📊</span>
              </div>
              <div>
                <h1 className="h2 mb-1" style={{ color: 'var(--text-primary)' }}>
                  Attendance Management
                </h1>
                <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                  View and manage student attendance records
                </p>
              </div>
            </div>
            <button
              onClick={refreshData}
              disabled={loading || !selectedSubject}
              className="btn d-flex align-items-center"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Loading...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '0.5rem' }}>🔄</span>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Subject Selection */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                Select Subject
              </label>
              <select
                className="form-select"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '0.5rem'
                }}
              >
                <option value="">-- Select Subject --</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name} {subject.classCode && `(${subject.classCode})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {selectedSubject && (
        <>
          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body">
                  <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>📅</div>
                  <h3 style={{ color: 'var(--text-primary)' }}>{totalSessions}</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Sessions</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body">
                  <div style={{ fontSize: '2rem', color: 'var(--info)' }}>👥</div>
                  <h3 style={{ color: 'var(--text-primary)' }}>{totalStudents}</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Records</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body">
                  <div style={{ fontSize: '2rem', color: 'var(--success)' }}>✅</div>
                  <h3 style={{ color: 'var(--text-primary)' }}>{presentStudents}</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Present Students</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body">
                  <div style={{ fontSize: '2rem', color: 'var(--warning)' }}>📈</div>
                  <h3 style={{ color: 'var(--text-primary)' }}>{attendanceRate}%</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Attendance Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                Filter by Date
              </label>
              <select
                className="form-select"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '0.5rem'
                }}
              >
                <option value="">All Dates</option>
                {dates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                Filter by Class Code
              </label>
              <select
                className="form-select"
                value={selectedClassCode}
                onChange={e => setSelectedClassCode(e.target.value)}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '0.5rem'
                }}
              >
                <option value="all">All Class Codes</option>
                {classCodes.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button
                onClick={() => {
                  setSelectedDate('');
                  setSelectedClassCode('all');
                }}
                className="btn w-100"
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: 'white',
                  border: 'none'
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <span style={{ marginRight: '0.5rem' }}>⚠️</span>
              <div>{error}</div>
            </div>
          )}
          {success && (
            <div className="alert alert-success d-flex align-items-center" role="alert">
              <span style={{ marginRight: '0.5rem' }}>✅</span>
              <div>{success}</div>
            </div>
          )}

          {/* Attendance Table */}
          <div className="card shadow-sm border-0">
            <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <h5 className="card-title mb-0">
                <span style={{ marginRight: '0.5rem' }}>📋</span>
                Attendance Records ({filteredRecords.length} sessions)
              </h5>
              <small>
                Showing {filteredRecords.reduce((total, session) => total + (session.attendanceRecords?.length || 0), 0)} records
              </small>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>📭</div>
                  <h5 style={{ color: 'var(--text-secondary)' }}>No Attendance Records</h5>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {selectedDate || selectedClassCode !== 'all' 
                      ? 'No records match your current filters' 
                      : 'No attendance records found for this subject'
                    }
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <tr>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Date</th>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Class Code</th>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Student</th>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Status</th>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Sign In</th>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Sign Out</th>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map(session =>
                        session.attendanceRecords?.map(record => {
                          const status = getStatusBadge(record);
                          return (
                            <tr key={record._id} style={{ borderColor: 'var(--border-light)' }}>
                              <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                {session.classDate ? new Date(session.classDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                }) : 'N/A'}
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <span 
                                  style={{
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '500'
                                  }}
                                >
                                  {session.classCode}
                                </span>
                              </td>
                              <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                                <strong>{record.student?.name || 'N/A'}</strong>
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <span 
                                  style={{
                                    backgroundColor: status.color,
                                    color: 'white',
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '500'
                                  }}
                                >
                                  {status.text}
                                </span>
                              </td>
                              <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {record.signInTime
                                  ? new Date(record.signInTime).toLocaleTimeString()
                                  : "N/A"}
                              </td>
                              <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {record.signOutTime
                                  ? new Date(record.signOutTime).toLocaleTimeString()
                                  : "N/A"}
                              </td>
                              <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {getDuration(record.signInTime, record.signOutTime)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance;