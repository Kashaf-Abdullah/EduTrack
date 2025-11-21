// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const StudentAttendance = () => {
//   const { user, token } = useContext(AuthContext);
//   const [enrolledClasses, setEnrolledClasses] = useState([]);
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Assume enrolled classes available in user.enrolledClasses or fetch from backend if needed
// useEffect(() => {
//   if (!token || !user) return;
//   const fetchEnrolledClasses = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/subjects/student/enrolled', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setEnrolledClasses(res.data);
//     } catch (error) {
//       setError('Failed to load enrolled classes');
//     }
//   };
//   fetchEnrolledClasses();
// }, [token, user]);


//   // Fetch student's attendance records
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
//         setError('Failed to fetch attendance data');
//       }
//     };

//     fetchAttendance();
//   }, [token, user]);

//   // Mark attendance function: signIn and/or signOut for a class
// // Improved markAttendance function with better state management
// const markAttendance = async ({ subjectId, classCode, signIn, signOut }) => {
//   try {
//     const classDate = new Date().toISOString().split('T')[0];

//     const attendancePayload = {
//       subjectId,
//       classDate,
//       classCode,
//       attendanceRecords: [
//         {
//           student: user._id || user.id,
//           signInTime: signIn ? new Date().toISOString() : null,
//           signOutTime: signOut ? new Date().toISOString() : null,
//           present: true,
//         },
//       ],
//     };

//     console.log('Sending attendance payload:', attendancePayload);

//     const response = await axios.post(
//       'http://localhost:5000/api/attendance', 
//       attendancePayload, 
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     console.log('Attendance response:', response.data);

//     setSuccess(signIn ? 'Signed in successfully!' : 'Signed out successfully!');
//     setError('');

//     // IMMEDIATELY update the local state with the response data
//     if (response.data.attendance) {
//       const newAttendanceRecord = response.data.attendance;
      
//       // Update attendanceRecords state
//       setAttendanceRecords(prevRecords => {
//         // Remove any existing record for today with same subject and class code
//         const filteredRecords = prevRecords.filter(record => {
//           if (!record.subject || record.subject._id !== subjectId) return true;
//           if (record.classCode !== classCode) return true;
          
//           const recordDate = new Date(record.classDate).toISOString().split('T')[0];
//           return recordDate !== classDate;
//         });
        
//         // Add the new/updated record
//         return [...filteredRecords, newAttendanceRecord];
//       });
//     }

//   } catch (error) {
//     console.error('Attendance error:', {
//       message: error.response?.data?.message,
//       status: error.response?.status,
//       data: error.response?.data
//     });
//     setError(error.response?.data?.message || 'Failed to mark attendance');
//     setSuccess('');
//   }
// };
// const checkCurrentStatus = (subjectId, classCode) => {
//   try {
//     console.log('Checking status for:', { subjectId, classCode, attendanceRecords });
    
//     // Get today's date
//     const today = new Date().toISOString().split('T')[0];
//     const studentId = user._id || user.id;

//     // Find today's attendance record for this subject and class
//     const todayRecord = attendanceRecords.find(record => {
//       if (!record.subject || !record.classDate) return false;
      
//       const recordDate = new Date(record.classDate).toISOString().split('T')[0];
//       const sameSubject = record.subject._id === subjectId || record.subject === subjectId;
//       const sameClassCode = record.classCode === classCode;
//       const sameDate = recordDate === today;
      
//       return sameSubject && sameClassCode && sameDate;
//     });

//     console.log('Today record found:', todayRecord);

//     if (!todayRecord) {
//       return 'not-marked-today';
//     }

//     // Find student's record in today's attendance
//     const studentRecord = todayRecord.attendanceRecords.find(ar => {
//       if (!ar.student) return false;
      
//       // Handle both populated student object and direct ID
//       const arStudentId = ar.student._id ? ar.student._id.toString() : ar.student.toString();
//       return arStudentId === studentId.toString();
//     });

//     console.log('Student record found:', studentRecord);

//     if (!studentRecord) {
//       return 'not-marked-today';
//     }

//     // Check if currently signed in (has signInTime but no signOutTime)
//     if (studentRecord.signInTime && !studentRecord.signOutTime) {
//       return 'signed-in';
//     }

//     // Has both sign in and out times (completed session)
//     if (studentRecord.signInTime && studentRecord.signOutTime) {
//       return 'signed-out';
//     }

//     return 'unknown';
//   } catch (error) {
//     console.error('Error checking status:', error);
//     return 'error';
//   }
// };
//  return (
//   <div>
//     <h2>Your Classes Attendance</h2>
//     {error && <p style={{ color: 'red' }}>{error}</p>}
//     {success && <p style={{ color: 'green' }}>{success}</p>}

//     {enrolledClasses.length === 0 && <p>You are not enrolled in any classes.</p>}

//     {enrolledClasses.map((cls) => {
//       const currentStatus = checkCurrentStatus(cls._id, cls.classCode);
//       const statusColors = {
//         'no-records': 'gray',
//         'no-records-today': 'blue',
//         'not-marked-today': 'orange',
//         'signed-in': 'green',
//         'signed-out': 'red',
//         'unknown': 'gray',
//         'error': 'red'
//       };
      
//       const statusMessages = {
//         'no-records': 'No attendance records',
//         'no-records-today': 'No attendance for today',
//         'not-marked-today': 'Not signed in today',
//         'signed-in': 'Currently Signed In',
//         'signed-out': 'Signed Out',
//         'unknown': 'Status Unknown',
//         'error': 'Error checking status'
//       };

//       return (
//         <div key={cls._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
//           <h3>{cls.name}</h3>
//           <p>
//             Status: <strong style={{ color: statusColors[currentStatus] }}>
//               {statusMessages[currentStatus]}
//             </strong>
//           </p>
//           <p>Class Code: <code>{cls.classCode}</code></p>
          
//           <button 
//             onClick={() => markAttendance({ 
//               subjectId: cls._id, 
//               classCode: cls.classCode, 
//               signIn: true 
//             })}
//             disabled={currentStatus === 'signed-in'}
//             style={{ 
//               backgroundColor: currentStatus === 'signed-in' ? '#ccc' : '#4CAF50',
//               color: 'white',
//               padding: '8px 16px',
//               margin: '5px',
//               border: 'none',
//               borderRadius: '4px'
//             }}
//           >
//             Sign In
//           </button>
          
//           <button 
//             onClick={() => markAttendance({ 
//               subjectId: cls._id, 
//               classCode: cls.classCode, 
//               signOut: true 
//             })}
//             disabled={currentStatus !== 'signed-in'}
//             style={{ 
//               backgroundColor: currentStatus !== 'signed-in' ? '#ccc' : '#f44336',
//               color: 'white',
//               padding: '8px 16px',
//               margin: '5px',
//               border: 'none',
//               borderRadius: '4px'
//             }}
//           >
//             Sign Out
//           </button>

//           <h4>Today's Attendance Records</h4>
//           {(() => {
//             const today = new Date().toISOString().split('T')[0];
//             const todayRecords = attendanceRecords
//               .filter(record => 
//                 record.subject && 
//                 record.subject._id === cls._id && 
//                 new Date(record.classDate).toISOString().split('T')[0] === today
//               );

//             if (todayRecords.length === 0) {
//               return <p>No attendance records for today.</p>;
//             }

//             return todayRecords.map(record => {
//               const studentRecord = record.attendanceRecords.find(
//                 ar => ar.student && (ar.student._id === (user._id || user.id) || ar.student === (user._id || user.id))
//               );
              
//               if (!studentRecord) return null;
              
//               return (
//                 <div key={record._id} style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f5f5f5' }}>
//                   <p>
//                     <strong>Date:</strong> {new Date(record.classDate).toLocaleDateString()} | 
//                     <strong> Present:</strong> {studentRecord.present ? 'Yes' : 'No'}
//                   </p>
//                   <p>
//                     <strong>Sign In:</strong> {studentRecord.signInTime ? 
//                       new Date(studentRecord.signInTime).toLocaleTimeString() : 'N/A'}
//                   </p>
//                   <p>
//                     <strong>Sign Out:</strong> {studentRecord.signOutTime ? 
//                       new Date(studentRecord.signOutTime).toLocaleTimeString() : 'Not signed out yet'}
//                   </p>
//                 </div>
//               );
//             });
//           })()}
//         </div>
//       );
//     })}
//   </div>
// );
// };

// export default StudentAttendance;


import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

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
        const res = await axios.get('http://localhost:5000/api/subjects/student/enrolled', {
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
        `http://localhost:5000/api/attendance/student/${user._id || user.id}`,
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
        'http://localhost:5000/api/attendance',
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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Your Classes Attendance</h2>
        <button
          onClick={refreshAttendanceData}
          disabled={refreshing}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: refreshing ? 'not-allowed' : 'pointer',
          }}>
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}><b>Error:</b> {error}</div>}
      {success && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}><b>Success:</b> {success}</div>}

      {enrolledClasses.length === 0 && !loading &&
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <p style={{ fontSize: '18px', color: '#6c757d', margin: 0 }}>
            You are not enrolled in any classes.
          </p>
        </div>
      }

      {enrolledClasses.map(cls => {
        const currentStatus = checkCurrentStatus(cls._id, cls.classCode);
        const statusConfig = {
          'not-marked-today': {
            color: '#ffc107',
            message: 'Not signed in today',
            signInDisabled: false,
            signOutDisabled: true,
          },
          'signed-in': {
            color: '#28a745',
            message: 'Currently Signed In',
            signInDisabled: true,
            signOutDisabled: false,
          },
          'signed-out': {
            color: '#6c757d',
            message: 'Signed Out',
            signInDisabled: false,
            signOutDisabled: true,
          },
          'unknown': {
            color: '#6c757d',
            message: 'Status Unknown',
            signInDisabled: false,
            signOutDisabled: true,
          },
          'error': {
            color: '#dc3545',
            message: 'Error checking status',
            signInDisabled: true,
            signOutDisabled: true,
          }
        };
        const { color, message, signInDisabled, signOutDisabled } = statusConfig[currentStatus] || statusConfig.unknown;

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
          <div key={cls._id} style={{
            border: `2px solid ${color}30`,
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h3 style={{ color: '#333', margin: '0 0 5px 0' }}>
                  {cls.name}
                </h3>
                <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
                  Class Code: <code style={{
                    backgroundColor: '#f8f9fa',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>{cls.classCode}</code>
                </p>
              </div>
              <div style={{
                backgroundColor: color + '20',
                color: color,
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span>{message}</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => markAttendance({
                  subjectId: cls._id,
                  classCode: cls.classCode,
                  signIn: true
                })}
                disabled={loading || signInDisabled}
                style={{
                  backgroundColor: signInDisabled ? '#6c757d' : '#28a745',
                  color: 'white',
                  padding: '10px 20px',
                  margin: '5px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: (loading || signInDisabled) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: (loading || signInDisabled) ? 0.7 : 1,
                }}>
                {loading ? 'Processing...' : 'Sign In'}
              </button>

              <button
                onClick={() => markAttendance({
                  subjectId: cls._id,
                  classCode: cls.classCode,
                  signOut: true
                })}
                disabled={loading || signOutDisabled}
                style={{
                  backgroundColor: signOutDisabled ? '#6c757d' : '#dc3545',
                  color: 'white',
                  padding: '10px 20px',
                  margin: '5px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: (loading || signOutDisabled) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: (loading || signOutDisabled) ? 0.7 : 1,
                }}>
                {loading ? 'Processing...' : 'Sign Out'}
              </button>
            </div>

            <div>
              <h4>Today's Attendance History</h4>
              {todayRecords.length === 0
                ? <div style={{ color: '#888', fontStyle: 'italic' }}>No attendance records for today.</div>
                : todayRecords.map(record => {
                  const studentEntries = record.attendanceRecords.filter(ar => {
                    if (!ar || !ar.student) return false;
                    const arStudentId = ar.student._id ? ar.student._id.toString() : ar.student.toString();
                    return arStudentId === studentId;
                  });
                  return studentEntries.map((entry, idx) =>
                    <div key={idx} style={{
                      padding: '12px',
                      margin: '8px 0',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #eee'
                    }}>
                      <strong>Sign In:</strong> {entry.signInTime ? new Date(entry.signInTime).toLocaleTimeString() : 'N/A'}<br />
                      <strong>Sign Out:</strong> {entry.signOutTime ? new Date(entry.signOutTime).toLocaleTimeString() : <span style={{ color: '#dc3545' }}>Not signed out yet</span>}
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentAttendance;
