// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const ViewAttendance = () => {
//   const { token, user } = useContext(AuthContext);
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (!token || !user) return;
//     const fetchAttendance = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/attendance/student/${user.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAttendanceRecords(response.data);
//         setError('');
//       } catch {
//         setError('Failed to fetch attendance');
//       }
//     };
//     fetchAttendance();
//   }, [token, user]);

//   return (
//     <div>
//       <h2>Your Attendance</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {attendanceRecords.length === 0 ? (
//         <p>No attendance records found.</p>
//       ) : (
//         <table border="1" cellPadding="6" cellSpacing="0" width="100%">
//           <thead>
//             <tr>
//               <th>Subject</th>
//               <th>Class Date</th>
//               <th>Present</th>
//               <th>Sign In Time</th>
//               <th>Sign Out Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceRecords.map((record) =>
//               record.attendanceRecords.map((att) => (
//                 <tr key={att._id}>
//                   <td>{record.subject?.name || 'N/A'}</td>
//                   <td>{new Date(record.classDate).toLocaleDateString()}</td>
//                   <td>{att.present ? 'Yes' : 'No'}</td>
//                   <td>{att.signInTime ? new Date(att.signInTime).toLocaleString() : 'N/A'}</td>
//                   <td>{att.signOutTime ? new Date(att.signOutTime).toLocaleString() : 'N/A'}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ViewAttendance;


import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const ViewAttendance = () => {
  const { token, user } = useContext(AuthContext);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, present, absent
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    if (!token || !user) return;
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/attendance/student/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendanceRecords(response.data);
        setError('');
      } catch {
        setError('Failed to fetch attendance records');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [token, user]);

  // Get unique subjects for filter
  const subjects = [...new Set(attendanceRecords
    .map(record => record.subject?.name)
    .filter(name => name)
  )];

  // Filter records based on selected filters
  const filteredRecords = attendanceRecords.filter(record => {
    const subjectMatch = selectedSubject === 'all' || record.subject?.name === selectedSubject;
    
    if (filter === 'all') return subjectMatch;
    if (filter === 'present') {
      return subjectMatch && record.attendanceRecords.some(att => att.present);
    }
    if (filter === 'absent') {
      return subjectMatch && record.attendanceRecords.every(att => !att.present);
    }
    return subjectMatch;
  });

  // Calculate statistics
  const totalClasses = attendanceRecords.length;
  const presentClasses = attendanceRecords.filter(record => 
    record.attendanceRecords.some(att => att.present)
  ).length;
  const attendancePercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;

  const refreshData = async () => {
    if (!token || !user) return;
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/attendance/student/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceRecords(response.data);
      setError('');
    } catch {
      setError('Failed to refresh attendance data');
    } finally {
      setLoading(false);
    }
  };

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
                  Attendance History
                </h1>
                <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                  View your complete attendance records
                </p>
              </div>
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
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

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>📚</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{totalClasses}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Classes</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--success)' }}>✅</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{presentClasses}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Present</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--info)' }}>📈</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{attendancePercentage}%</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="subjectFilter" className="form-label" style={{ color: 'var(--text-primary)' }}>
            Filter by Subject
          </label>
          <select
            id="subjectFilter"
            className="form-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              border: '1px solid var(--border-light)',
              borderRadius: '0.5rem'
            }}
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="statusFilter" className="form-label" style={{ color: 'var(--text-primary)' }}>
            Filter by Status
          </label>
          <select
            id="statusFilter"
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              border: '1px solid var(--border-light)',
              borderRadius: '0.5rem'
            }}
          >
            <option value="all">All Records</option>
            <option value="present">Present Only</option>
            <option value="absent">Absent Only</option>
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span style={{ marginRight: '0.5rem' }}>⚠️</span>
          <div>{error}</div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
          <h5 className="card-title mb-0">
            <span style={{ marginRight: '0.5rem' }}>📋</span>
            Attendance Records
          </h5>
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
              <h5 style={{ color: 'var(--text-secondary)' }}>No attendance records found</h5>
              <p style={{ color: 'var(--text-secondary)' }}>No records match your current filters</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <tr>
                    <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Subject</th>
                    <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Class Date</th>
                    <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Status</th>
                    <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Sign In Time</th>
                    <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Sign Out Time</th>
                    <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) =>
                    record.attendanceRecords.map((att) => {
                      const signInTime = att.signInTime ? new Date(att.signInTime) : null;
                      const signOutTime = att.signOutTime ? new Date(att.signOutTime) : null;
                      let duration = 'N/A';
                      
                      if (signInTime && signOutTime) {
                        const diffMs = signOutTime - signInTime;
                        const hours = Math.floor(diffMs / (1000 * 60 * 60));
                        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                        duration = `${hours}h ${minutes}m`;
                      } else if (signInTime && !signOutTime) {
                        duration = 'Still present';
                      }

                      return (
                        <tr key={att._id} style={{ borderColor: 'var(--border-light)' }}>
                          <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                            <strong>{record.subject?.name || 'N/A'}</strong>
                            {record.classCode && (
                              <div>
                                <small className="text-muted">Code: {record.classCode}</small>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                            {new Date(record.classDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span 
                              className={`badge ${att.present ? 'bg-success' : 'bg-danger'}`}
                              style={{ fontSize: '0.8rem' }}
                            >
                              {att.present ? 'Present' : 'Absent'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                            {att.signInTime ? new Date(att.signInTime).toLocaleTimeString() : 'N/A'}
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                            {att.signOutTime ? new Date(att.signOutTime).toLocaleTimeString() : 'N/A'}
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                            <small>{duration}</small>
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

      {/* Summary */}
      {filteredRecords.length > 0 && (
        <div className="row mt-3">
          <div className="col-12">
            <div className="text-end">
              <small style={{ color: 'var(--text-secondary)' }}>
                Showing {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
                {selectedSubject !== 'all' && ` for ${selectedSubject}`}
                {filter !== 'all' && ` (${filter} only)`}
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;