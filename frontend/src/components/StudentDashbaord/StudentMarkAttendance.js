
// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const StudentAttendance = () => {
//   const { user, token } = useContext(AuthContext);
//   const [enrolledClasses, setEnrolledClasses] = useState([]);
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // Fetch enrolled classes
//   useEffect(() => {
//     if (!token || !user) return;
//     const fetchEnrolledClasses = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get('http://localhost:5000/api/subjects/student/enrolled', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setEnrolledClasses(res.data);
//         setError('');
//       } catch (error) {
//         setError('Failed to load enrolled classes');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEnrolledClasses();
//   }, [token, user]);

//   // Fetch student's attendance records
//   const fetchAttendanceData = async () => {
//     if (!token || !user) return;
//     try {
//       setRefreshing(true);
//       const response = await axios.get(
//         `http://localhost:5000/api/attendance/student/${user._id || user.id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setAttendanceRecords(response.data);
//       setError('');
//     } catch (error) {
//       setError('Failed to fetch attendance data');
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendanceData();
//   }, [token, user]);

//   // Find the latest attendance entry of the student for today
//   const getLatestStudentEntry = (subjectId, classCode) => {
//     const today = new Date().toISOString().split('T')[0];
//     const studentId = (user._id || user.id).toString();
//     const todayRecord = attendanceRecords.find(record => {
//       if (!record || !record.subject || !record.classDate) return false;
//       const recordDate = new Date(record.classDate).toISOString().split('T')[0];
//       const subjectMatch =
//         record.subject._id?.toString() === subjectId.toString() ||
//         record.subject.id === subjectId.toString() ||
//         record.subject.toString() === subjectId.toString();
//       const classCodeMatch = record.classCode === classCode;
//       const dateMatch = recordDate === today;
//       return subjectMatch && classCodeMatch && dateMatch;
//     });

//     if (!todayRecord) return null;

//     // Find all of this student's entries today
//     const studentEntries = todayRecord.attendanceRecords.filter(ar => {
//       if (!ar || !ar.student) return false;
//       const arStudentId =
//         ar.student._id ? ar.student._id.toString() :
//         ar.student.id ? ar.student.id.toString() :
//         ar.student.toString();
//       return arStudentId === studentId;
//     });

//     // Return the latest entry (last one)
//     return studentEntries.length > 0 ? studentEntries[studentEntries.length - 1] : null;
//   };

//   const checkCurrentStatus = (subjectId, classCode) => {
//     try {
//       const latestEntry = getLatestStudentEntry(subjectId, classCode);
//       if (!latestEntry) return 'not-marked-today';
//       if (latestEntry.signInTime && !latestEntry.signOutTime) return 'signed-in';
//       if (latestEntry.signInTime && latestEntry.signOutTime) return 'signed-out';
//       return 'unknown';
//     } catch (error) {
//       return 'error';
//     }
//   };

//   // Mark attendance (sign-in or sign-out)
//   const markAttendance = async ({ subjectId, classCode, signIn, signOut }) => {
//     try {
//       setLoading(true);
//       const classDate = new Date().toISOString().split('T')[0];
//       const attendancePayload = {
//         subjectId,
//         classDate,
//         classCode,
//         attendanceRecords: [
//           {
//             student: user._id || user.id,
//             signInTime: signIn ? new Date().toISOString() : null,
//             signOutTime: signOut ? new Date().toISOString() : null,
//             present: true,
//           },
//         ],
//       };
//       const response = await axios.post(
//         'http://localhost:5000/api/attendance',
//         attendancePayload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSuccess(signIn ? 'Signed in successfully! ✅' : 'Signed out successfully! ✅');
//       setError('');
//       setTimeout(() => {
//         fetchAttendanceData();
//       }, 500);
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to mark attendance');
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshAttendanceData = async () => {
//     await fetchAttendanceData();
//     setSuccess('Attendance data refreshed! 🔄');
//   };

//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         setSuccess('');
//         setError('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success, error]);

//   return (
//     <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <h2>Your Classes Attendance</h2>
//         <button
//           onClick={refreshAttendanceData}
//           disabled={refreshing}
//           style={{
//             padding: '8px 16px',
//             backgroundColor: '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: refreshing ? 'not-allowed' : 'pointer',
//           }}>
//           {refreshing ? 'Refreshing...' : 'Refresh Data'}
//         </button>
//       </div>
//       {loading && <p>Loading...</p>}
//       {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}><b>Error:</b> {error}</div>}
//       {success && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}><b>Success:</b> {success}</div>}

//       {enrolledClasses.length === 0 && !loading &&
//         <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
//           <p style={{ fontSize: '18px', color: '#6c757d', margin: 0 }}>
//             You are not enrolled in any classes.
//           </p>
//         </div>
//       }

//       {enrolledClasses.map(cls => {
//         const currentStatus = checkCurrentStatus(cls._id, cls.classCode);
//         const statusConfig = {
//           'not-marked-today': {
//             color: '#ffc107',
//             message: 'Not signed in today',
//             signInDisabled: false,
//             signOutDisabled: true,
//           },
//           'signed-in': {
//             color: '#28a745',
//             message: 'Currently Signed In',
//             signInDisabled: true,
//             signOutDisabled: false,
//           },
//           'signed-out': {
//             color: '#6c757d',
//             message: 'Signed Out',
//             signInDisabled: false,
//             signOutDisabled: true,
//           },
//           'unknown': {
//             color: '#6c757d',
//             message: 'Status Unknown',
//             signInDisabled: false,
//             signOutDisabled: true,
//           },
//           'error': {
//             color: '#dc3545',
//             message: 'Error checking status',
//             signInDisabled: true,
//             signOutDisabled: true,
//           }
//         };
//         const { color, message, signInDisabled, signOutDisabled } = statusConfig[currentStatus] || statusConfig.unknown;

//         const today = new Date().toISOString().split('T')[0];
//         const studentId = (user._id || user.id).toString();
//         const todayRecords = attendanceRecords.filter(record => {
//           if (!record || !record.subject || !record.classDate) return false;
//           const recordDate = new Date(record.classDate).toISOString().split('T')[0];
//           const subjectMatch =
//             record.subject._id?.toString() === cls._id.toString() ||
//             record.subject.id === cls._id.toString() ||
//             record.subject.toString() === cls._id.toString();
//           const classCodeMatch = record.classCode === cls.classCode;
//           const dateMatch = recordDate === today;
//           return subjectMatch && classCodeMatch && dateMatch;
//         });

//         return (
//           <div key={cls._id} style={{
//             border: `2px solid ${color}30`,
//             borderRadius: '12px',
//             padding: '20px',
//             backgroundColor: 'white',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//             marginBottom: '24px',
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
//               <div>
//                 <h3 style={{ color: '#333', margin: '0 0 5px 0' }}>
//                   {cls.name}
//                 </h3>
//                 <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
//                   Class Code: <code style={{
//                     backgroundColor: '#f8f9fa',
//                     padding: '2px 6px',
//                     borderRadius: '4px'
//                   }}>{cls.classCode}</code>
//                 </p>
//               </div>
//               <div style={{
//                 backgroundColor: color + '20',
//                 color: color,
//                 padding: '6px 12px',
//                 borderRadius: '20px',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '5px'
//               }}>
//                 <span>{message}</span>
//               </div>
//             </div>

//             <div style={{ marginBottom: '20px' }}>
//               <button
//                 onClick={() => markAttendance({
//                   subjectId: cls._id,
//                   classCode: cls.classCode,
//                   signIn: true
//                 })}
//                 disabled={loading || signInDisabled}
//                 style={{
//                   backgroundColor: signInDisabled ? '#6c757d' : '#28a745',
//                   color: 'white',
//                   padding: '10px 20px',
//                   margin: '5px',
//                   border: 'none',
//                   borderRadius: '6px',
//                   cursor: (loading || signInDisabled) ? 'not-allowed' : 'pointer',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   opacity: (loading || signInDisabled) ? 0.7 : 1,
//                 }}>
//                 {loading ? 'Processing...' : 'Sign In'}
//               </button>

//               <button
//                 onClick={() => markAttendance({
//                   subjectId: cls._id,
//                   classCode: cls.classCode,
//                   signOut: true
//                 })}
//                 disabled={loading || signOutDisabled}
//                 style={{
//                   backgroundColor: signOutDisabled ? '#6c757d' : '#dc3545',
//                   color: 'white',
//                   padding: '10px 20px',
//                   margin: '5px',
//                   border: 'none',
//                   borderRadius: '6px',
//                   cursor: (loading || signOutDisabled) ? 'not-allowed' : 'pointer',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   opacity: (loading || signOutDisabled) ? 0.7 : 1,
//                 }}>
//                 {loading ? 'Processing...' : 'Sign Out'}
//               </button>
//             </div>

//             <div>
//               <h4>Today's Attendance History</h4>
//               {todayRecords.length === 0
//                 ? <div style={{ color: '#888', fontStyle: 'italic' }}>No attendance records for today.</div>
//                 : todayRecords.map(record => {
//                   const studentEntries = record.attendanceRecords.filter(ar => {
//                     if (!ar || !ar.student) return false;
//                     const arStudentId = ar.student._id ? ar.student._id.toString() : ar.student.toString();
//                     return arStudentId === studentId;
//                   });
//                   return studentEntries.map((entry, idx) =>
//                     <div key={idx} style={{
//                       padding: '12px',
//                       margin: '8px 0',
//                       backgroundColor: '#f8f9fa',
//                       borderRadius: '8px',
//                       border: '1px solid #eee'
//                     }}>
//                       <strong>Sign In:</strong> {entry.signInTime ? new Date(entry.signInTime).toLocaleTimeString() : 'N/A'}<br />
//                       <strong>Sign Out:</strong> {entry.signOutTime ? new Date(entry.signOutTime).toLocaleTimeString() : <span style={{ color: '#dc3545' }}>Not signed out yet</span>}
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default StudentAttendance;



import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api.js';

const StudentAttendance = () => {
  const { user, token } = useContext(AuthContext);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch enrolled classes
  useEffect(() => {
    if (!token || !user) return;
    const fetchEnrolledClasses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/subjects/student/enrolled`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrolledClasses(res.data);
        setError('');
      } catch (error) {
        setError('Failed to load enrolled classes');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledClasses();
  }, [token, user]);

  // Fetch student's attendance records
  const fetchAttendanceData = async () => {
    if (!token || !user) return;
    try {
      setRefreshing(true);
      const response = await axios.get(
        `${API_BASE_URL}/attendance/student/${user._id || user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceRecords(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch attendance data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [token, user]);

  // Find the latest attendance entry of the student for today
  const getLatestStudentEntry = (subjectId, classCode) => {
    const today = new Date().toISOString().split('T')[0];
    const studentId = (user._id || user.id).toString();
    const todayRecord = attendanceRecords.find(record => {
      if (!record || !record.subject || !record.classDate) return false;
      const recordDate = new Date(record.classDate).toISOString().split('T')[0];
      const subjectMatch =
        record.subject._id?.toString() === subjectId.toString() ||
        record.subject.id === subjectId.toString() ||
        record.subject.toString() === subjectId.toString();
      const classCodeMatch = record.classCode === classCode;
      const dateMatch = recordDate === today;
      return subjectMatch && classCodeMatch && dateMatch;
    });

    if (!todayRecord) return null;

    // Find all of this student's entries today
    const studentEntries = todayRecord.attendanceRecords.filter(ar => {
      if (!ar || !ar.student) return false;
      const arStudentId =
        ar.student._id ? ar.student._id.toString() :
        ar.student.id ? ar.student.id.toString() :
        ar.student.toString();
      return arStudentId === studentId;
    });

    // Return the latest entry (last one)
    return studentEntries.length > 0 ? studentEntries[studentEntries.length - 1] : null;
  };

  const checkCurrentStatus = (subjectId, classCode) => {
    try {
      const latestEntry = getLatestStudentEntry(subjectId, classCode);
      if (!latestEntry) return 'not-marked-today';
      if (latestEntry.signInTime && !latestEntry.signOutTime) return 'signed-in';
      if (latestEntry.signInTime && latestEntry.signOutTime) return 'signed-out';
      return 'unknown';
    } catch (error) {
      return 'error';
    }
  };

  // Mark attendance (sign-in or sign-out)
  const markAttendance = async ({ subjectId, classCode, signIn, signOut }) => {
    try {
      setLoading(true);
      const classDate = new Date().toISOString().split('T')[0];
      const attendancePayload = {
        subjectId,
        classDate,
        classCode,
        attendanceRecords: [
          {
            student: user._id || user.id,
            signInTime: signIn ? new Date().toISOString() : null,
            signOutTime: signOut ? new Date().toISOString() : null,
            present: true,
          },
        ],
      };
      const response = await axios.post(
        `${API_BASE_URL}/attendance`,
        attendancePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(signIn ? 'Signed in successfully! ✅' : 'Signed out successfully! ✅');
      setError('');
      setTimeout(() => {
        fetchAttendanceData();
      }, 500);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to mark attendance');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const refreshAttendanceData = async () => {
    await fetchAttendanceData();
    setSuccess('Attendance data refreshed! 🔄');
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

  // Function to get status badge style
  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      fontSize: '0.875rem',
      fontWeight: '600',
      padding: '0.375rem 0.75rem',
      borderRadius: '1.5rem'
    };

    switch (status) {
      case 'not-marked-today':
        return { ...baseStyle, backgroundColor: 'var(--warning)', color: 'var(--text-primary)' };
      case 'signed-in':
        return { ...baseStyle, backgroundColor: 'var(--success)', color: 'white' };
      case 'signed-out':
        return { ...baseStyle, backgroundColor: 'var(--secondary)', color: 'white' };
      case 'error':
        return { ...baseStyle, backgroundColor: 'var(--error)', color: 'white' };
      default:
        return { ...baseStyle, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' };
    }
  };

  // Function to get status message
  const getStatusMessage = (status) => {
    switch (status) {
      case 'not-marked-today': return 'Not signed in today';
      case 'signed-in': return 'Currently Signed In';
      case 'signed-out': return 'Signed Out';
      case 'error': return 'Error checking status';
      default: return 'Status Unknown';
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
                <span style={{ color: 'white', fontSize: '1.5rem' }}>📚</span>
              </div>
              <div>
                <h1 className="h2 mb-1" style={{ color: 'var(--text-primary)' }}>
                  Class Attendance
                </h1>
                <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                  Manage your daily class attendance
                </p>
              </div>
            </div>
            <button
              onClick={refreshAttendanceData}
              disabled={refreshing}
              className="btn d-flex align-items-center"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none'
              }}
            >
              {refreshing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Refreshing...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '0.5rem' }}>🔄</span>
                  Refresh Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span style={{ marginRight: '0.5rem' }}>⚠️</span>
          <div><strong>Error:</strong> {error}</div>
        </div>
      )}
      {success && (
        <div className="alert alert-success d-flex align-items-center" role="alert">
          <span style={{ marginRight: '0.5rem' }}>✅</span>
          <div><strong>Success:</strong> {success}</div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* No Classes State */}
      {enrolledClasses.length === 0 && !loading && (
        <div className="text-center py-5" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '0.75rem' }}>
          <div style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>📚</div>
          <h5 style={{ color: 'var(--text-secondary)' }}>No Enrolled Classes</h5>
          <p style={{ color: 'var(--text-secondary)' }}>You are not enrolled in any classes yet.</p>
        </div>
      )}

      {/* Classes List */}
      <div className="row">
        {enrolledClasses.map(cls => {
          const currentStatus = checkCurrentStatus(cls._id, cls.classCode);
          const statusConfig = {
            'not-marked-today': { signInDisabled: false, signOutDisabled: true },
            'signed-in': { signInDisabled: true, signOutDisabled: false },
            'signed-out': { signInDisabled: false, signOutDisabled: true },
            'unknown': { signInDisabled: false, signOutDisabled: true },
            'error': { signInDisabled: true, signOutDisabled: true }
          };
          const { signInDisabled, signOutDisabled } = statusConfig[currentStatus] || statusConfig.unknown;

          const today = new Date().toISOString().split('T')[0];
          const studentId = (user._id || user.id).toString();
          const todayRecords = attendanceRecords.filter(record => {
            if (!record || !record.subject || !record.classDate) return false;
            const recordDate = new Date(record.classDate).toISOString().split('T')[0];
            const subjectMatch =
              record.subject._id?.toString() === cls._id.toString() ||
              record.subject.id === cls._id.toString() ||
              record.subject.toString() === cls._id.toString();
            const classCodeMatch = record.classCode === cls.classCode;
            const dateMatch = recordDate === today;
            return subjectMatch && classCodeMatch && dateMatch;
          });

          return (
            <div key={cls._id} className="col-12 mb-4">
              <div className="card shadow-sm border-0">
                {/* Card Header */}
                <div 
                  className="card-header d-flex justify-content-between align-items-center py-3"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  <div>
                    <h5 className="card-title mb-1">{cls.name}</h5>
                    <p className="mb-0 small">
                      Class Code: <code className="bg-light text-dark px-2 py-1 rounded">{cls.classCode}</code>
                    </p>
                  </div>
                  <span style={getStatusBadgeStyle(currentStatus)}>
                    {getStatusMessage(currentStatus)}
                  </span>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  {/* Action Buttons */}
                  <div className="d-flex gap-2 mb-4">
                    <button
                      onClick={() => markAttendance({
                        subjectId: cls._id,
                        classCode: cls.classCode,
                        signIn: true
                      })}
                      disabled={loading || signInDisabled}
                      className="btn d-flex align-items-center"
                      style={{
                        backgroundColor: signInDisabled ? 'var(--bg-secondary)' : 'var(--success)',
                        color: signInDisabled ? 'var(--text-secondary)' : 'white',
                        border: 'none',
                        opacity: (loading || signInDisabled) ? 0.6 : 1
                      }}
                    >
                      <span style={{ marginRight: '0.5rem' }}>📥</span>
                      {loading ? 'Processing...' : 'Sign In'}
                    </button>

                    <button
                      onClick={() => markAttendance({
                        subjectId: cls._id,
                        classCode: cls.classCode,
                        signOut: true
                      })}
                      disabled={loading || signOutDisabled}
                      className="btn d-flex align-items-center"
                      style={{
                        backgroundColor: signOutDisabled ? 'var(--bg-secondary)' : 'var(--error)',
                        color: signOutDisabled ? 'var(--text-secondary)' : 'white',
                        border: 'none',
                        opacity: (loading || signOutDisabled) ? 0.6 : 1
                      }}
                    >
                      <span style={{ marginRight: '0.5rem' }}>📤</span>
                      {loading ? 'Processing...' : 'Sign Out'}
                    </button>
                  </div>

                  {/* Today's Attendance History */}
                  <div>
                    <h6 className="mb-3" style={{ color: 'var(--text-primary)' }}>
                      <span style={{ marginRight: '0.5rem' }}>📅</span>
                      Today's Attendance History
                    </h6>
                    {todayRecords.length === 0 ? (
                      <div className="text-center py-3" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                        <p className="mb-0 text-muted">No attendance records for today</p>
                      </div>
                    ) : (
                      <div className="row">
                        {todayRecords.map((record, recordIndex) => {
                          const studentEntries = record.attendanceRecords.filter(ar => {
                            if (!ar || !ar.student) return false;
                            const arStudentId = ar.student._id ? ar.student._id.toString() : ar.student.toString();
                            return arStudentId === studentId;
                          });
                          
                          return studentEntries.map((entry, entryIndex) => (
                            <div key={`${recordIndex}-${entryIndex}`} className="col-md-6 mb-2">
                              <div 
                                className="p-3 rounded h-100"
                                style={{
                                  backgroundColor: 'var(--bg-secondary)',
                                  border: '1px solid var(--border-light)'
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small className="text-muted">Session {entryIndex + 1}</small>
                                  {!entry.signOutTime && (
                                    <span className="badge bg-warning text-dark">Active</span>
                                  )}
                                </div>
                                <div className="row">
                                  <div className="col-6">
                                    <strong>Sign In:</strong><br />
                                    <span style={{ color: 'var(--text-secondary)' }}>
                                      {entry.signInTime ? new Date(entry.signInTime).toLocaleTimeString() : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="col-6">
                                    <strong>Sign Out:</strong><br />
                                    <span style={{ 
                                      color: entry.signOutTime ? 'var(--text-secondary)' : 'var(--error)'
                                    }}>
                                      {entry.signOutTime ? new Date(entry.signOutTime).toLocaleTimeString() : 'Not signed out'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ));
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      {enrolledClasses.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <div className="card-body py-3">
                <div className="row text-center">
                  <div className="col-md-3">
                    <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.5rem' }}>
                      {enrolledClasses.length}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Total Classes
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.5rem' }}>
                      {enrolledClasses.filter(cls => checkCurrentStatus(cls._id, cls.classCode) === 'signed-in').length}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Currently Signed In
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div style={{ color: 'var(--warning)', fontWeight: 'bold', fontSize: '1.5rem' }}>
                      {enrolledClasses.filter(cls => checkCurrentStatus(cls._id, cls.classCode) === 'not-marked-today').length}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Pending Sign In
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '1.5rem' }}>
                      {enrolledClasses.filter(cls => checkCurrentStatus(cls._id, cls.classCode) === 'signed-out').length}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Signed Out Today
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;