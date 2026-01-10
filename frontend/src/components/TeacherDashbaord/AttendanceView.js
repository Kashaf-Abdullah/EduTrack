// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const AttendanceView = () => {
//   const { user, token } = useContext(AuthContext);
//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [error, setError] = useState('');

//   // Fetch teacher classes on load
//   useEffect(() => {
//     if (!token || !user) return;
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/subjects', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const myClasses = response.data.filter(
//           (cls) => cls.teacher === user.id || (cls.teacher && cls.teacher.id === user.id)
//         );
//         setClasses(myClasses);
//       } catch {
//         setError('Failed to load classes');
//       }
//     };
//     fetchClasses();
//   }, [token, user]);

//   // Fetch attendance on class or date change
//   useEffect(() => {
//     if (!token || !user || !selectedClass) {
//       setAttendanceRecords([]);
//       return;
//     }
//     const fetchAttendance = async () => {
//       try {
//         const url = new URL(`${API_BASE_URL}/attendance/teacher/${user.id}`);
//         url.searchParams.set('classId', selectedClass);
//         if (selectedDate) url.searchParams.set('date', selectedDate);

//         const response = await axios.get(url.toString(), {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAttendanceRecords(response.data);
//         setError('');
//       } catch {
//         setError('Failed to fetch attendance');
//       }
//     };
//     fetchAttendance();
//   }, [selectedClass, selectedDate, token, user]);

//   return (
//     <div>
//       <h2>Attendance Dashboard</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <label>
//         Select Class:
//        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
//   <option value="">--Select Class--</option>
//   {classes.map(cls => (
//     <option key={cls._id} value={cls._id}>{cls.name}</option>
//   ))}
// </select>

//       </label>

//       <label style={{ marginLeft: '20px' }}>
//         Select Date:
//         <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
//       </label>

//       <h3>Attendance Records</h3>
//       {attendanceRecords.length === 0 ? (
//         <p>No attendance records found.</p>
//       ) : (
//         attendanceRecords.map((record) => (
//           <div key={record._id} style={{ marginBottom: '20px' }}>
//             <h4>{record.subject?.name} on {new Date(record.classDate).toLocaleDateString()}</h4>
//             <table border="1" cellPadding="6" cellSpacing="0" width="100%">
//               <thead>
//                 <tr>
//                   <th>Student Name</th>
//                   <th>Sign In</th>
//                   <th>Sign Out</th>
//                   <th>Present</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {record.attendanceRecords.map((att) => (
//                   <tr key={att.student?._id}>
//                     <td>{att.student?.name || 'N/A'}</td>
//                 <td>
//   {att.signInTime
//     ? new Date(att.signInTime).toLocaleDateString() + ' ' + new Date(att.signInTime).toLocaleTimeString()
//     : 'N/A'}
// </td>
// <td>
//   {att.signOutTime
//     ? new Date(att.signOutTime).toLocaleDateString() + ' ' + new Date(att.signOutTime).toLocaleTimeString()
//     : 'N/A'}
// </td>

//                    <td>{att.present ? 'Yes' : 'No'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AttendanceView;


import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api.js';

const AttendanceView = () => {
  const { user, token } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch teacher classes on load
  useEffect(() => {
    if (!token || !user) return;
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const myClasses = response.data.filter(
          (cls) => cls.teacher === user.id || (cls.teacher && cls.teacher.id === user.id)
        );
        setClasses(myClasses);
        setError('');
      } catch {
        setError('Failed to load classes');
      } finally {
        setLoading(false);
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
        setLoading(true);
        const url = new URL(`${API_BASE_URL}/attendance/teacher/${user.id}`);
        url.searchParams.set('classId', selectedClass);
        if (selectedDate) url.searchParams.set('date', selectedDate);

        const response = await axios.get(url.toString(), {
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
  }, [selectedClass, selectedDate, token, user]);

  // Calculate statistics
  const totalStudents = attendanceRecords.reduce((total, record) => 
    total + (record.attendanceRecords?.length || 0), 0
  );
  const presentStudents = attendanceRecords.reduce((total, record) => 
    total + (record.attendanceRecords?.filter(att => att.present)?.length || 0), 0
  );
  const activeStudents = attendanceRecords.reduce((total, record) => 
    total + (record.attendanceRecords?.filter(att => att.present && att.signInTime && !att.signOutTime)?.length || 0), 0
  );
  const attendanceRate = totalStudents > 0 ? ((presentStudents / totalStudents) * 100).toFixed(1) : 0;

  // Filter records based on status
  const filteredRecords = attendanceRecords.map(record => ({
    ...record,
    attendanceRecords: record.attendanceRecords?.filter(att => {
      if (selectedStatus === 'all') return true;
      if (selectedStatus === 'present') return att.present;
      if (selectedStatus === 'absent') return !att.present;
      if (selectedStatus === 'active') return att.present && att.signInTime && !att.signOutTime;
      if (selectedStatus === 'completed') return att.present && att.signInTime && att.signOutTime;
      return true;
    })
  })).filter(record => record.attendanceRecords?.length > 0);

  const getStatusBadge = (att) => {
    if (!att.present) {
      return { text: 'Absent', color: 'var(--error)', bgColor: 'var(--error)20' };
    }
    if (att.signInTime && !att.signOutTime) {
      return { text: 'Present (Active)', color: 'var(--success)', bgColor: 'var(--success)20' };
    }
    if (att.signInTime && att.signOutTime) {
      return { text: 'Present (Completed)', color: 'var(--info)', bgColor: 'var(--info)20' };
    }
    return { text: 'Marked Present', color: 'var(--warning)', bgColor: 'var(--warning)20' };
  };

  const getDuration = (signInTime, signOutTime) => {
    if (!signInTime) return 'N/A';
    if (!signOutTime) return 'Still present';
    
    const signIn = new Date(signInTime);
    const signOut = new Date(signOutTime);
    const diffMs = signOut - signIn;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  };

  const refreshData = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const url = new URL(`${API_BASE_URL}/attendance/teacher/${user.id}`);
      url.searchParams.set('classId', selectedClass);
      if (selectedDate) url.searchParams.set('date', selectedDate);

      const response = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceRecords(response.data);
      setSuccess('Attendance data refreshed successfully!');
      setError('');
    } catch {
      setError('Failed to refresh attendance data');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedDate('');
    setSelectedStatus('all');
  };

  const selectedClassName = classes.find(cls => cls._id === selectedClass)?.name || 'Selected Class';

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
                <span style={{ color: 'white', fontSize: '1.5rem' }}>👨‍🏫</span>
              </div>
              <div>
                <h1 className="h2 mb-1" style={{ color: 'var(--text-primary)' }}>
                  Teacher Attendance Dashboard
                </h1>
                <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                  Monitor and analyze student attendance
                </p>
              </div>
            </div>
            <button
              onClick={refreshData}
              disabled={loading || !selectedClass}
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

      {/* Filters Section */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                Select Class
              </label>
              <select 
                className="form-select"
                value={selectedClass} 
                onChange={e => setSelectedClass(e.target.value)}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '0.5rem'
                }}
              >
                <option value="">-- Select Class --</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} {cls.classCode && `(${cls.classCode})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                Filter by Date
              </label>
              <input 
                type="date" 
                className="form-control"
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '0.5rem'
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                Filter by Status
              </label>
              <select 
                className="form-select"
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '0.5rem'
                }}
              >
                <option value="all">All Students</option>
                <option value="present">Present Only</option>
                <option value="absent">Absent Only</option>
                <option value="active">Active Only</option>
                <option value="completed">Completed Only</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button
            onClick={clearFilters}
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

      {/* Statistics Cards */}
      {selectedClass && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>📊</div>
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
                <div style={{ fontSize: '2rem', color: 'var(--info)' }}>⏳</div>
                <h3 style={{ color: 'var(--text-primary)' }}>{activeStudents}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Active Now</p>
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
      )}

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

      {/* Attendance Records */}
      {selectedClass && (
        <div className="card shadow-sm border-0">
          <div className="card-header" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
            <h5 className="card-title mb-0">
              <span style={{ marginRight: '0.5rem' }}>📋</span>
              Attendance Records for {selectedClassName}
              {selectedDate && (
                <span style={{ marginLeft: '1rem', fontSize: '0.875rem', opacity: 0.9 }}>
                  on {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              )}
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
                <h5 style={{ color: 'var(--text-secondary)' }}>No Attendance Records</h5>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {selectedDate || selectedStatus !== 'all' 
                    ? 'No records match your current filters' 
                    : 'No attendance records found for this class'
                  }
                </p>
              </div>
            ) : (
              <div className="p-3">
                {filteredRecords.map((record) => (
                  <div key={record._id} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 p-3 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <div>
                        <h5 style={{ color: 'var(--text-primary)', margin: 0 }}>
                          {record.subject?.name} - {record.classCode}
                        </h5>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
                          {new Date(record.classDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span 
                        className="badge"
                        style={{
                          backgroundColor: 'var(--info)',
                          color: 'white',
                          fontSize: '0.875rem',
                          padding: '0.5rem 1rem'
                        }}
                      >
                        {record.attendanceRecords?.length || 0} students
                      </span>
                    </div>
                    
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                          <tr>
                            <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Student Name</th>
                            <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Status</th>
                            <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Sign In Time</th>
                            <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Sign Out Time</th>
                            <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {record.attendanceRecords?.map((att) => {
                            const status = getStatusBadge(att);
                            return (
                              <tr key={att.student?._id} style={{ borderColor: 'var(--border-light)' }}>
                                <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                                  <strong>{att.student?.name || 'N/A'}</strong>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                  <span 
                                    style={{
                                      backgroundColor: status.bgColor,
                                      color: status.color,
                                      padding: '0.375rem 0.75rem',
                                      borderRadius: '0.375rem',
                                      fontSize: '0.75rem',
                                      fontWeight: '500',
                                      border: `1px solid ${status.color}`
                                    }}
                                  >
                                    {status.text}
                                  </span>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                  {att.signInTime
                                    ? new Date(att.signInTime).toLocaleTimeString()
                                    : 'N/A'}
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                  {att.signOutTime
                                    ? new Date(att.signOutTime).toLocaleTimeString()
                                    : 'N/A'}
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                  {getDuration(att.signInTime, att.signOutTime)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceView;