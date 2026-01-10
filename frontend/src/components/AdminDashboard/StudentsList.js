
// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext'; // adjust path if needed

// function StudentsList() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [deleteLoading, setDeleteLoading] = useState(null);
//   const { token } = useContext(AuthContext);

//   // Fetch students and their subject enrollments
//   const fetchStudentsDetails = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/subjects/admin/students', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStudents(res.data);
//       setLoading(false);
//     } catch (err) {
//       setError('Error fetching students details');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) fetchStudentsDetails();
//   }, [token]);

//   // Remove a student from a specific subject
//   async function handleRemoveFromSubject(studentId, subjectId) {
//     if (!window.confirm("Remove student from this subject?")) return;
//     try {
//       await axios.post(
//         `${API_BASE_URL}/admin/remove-student-from-subject',
//         { studentId, subjectId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // Update state locally without reloading everything!
//       setStudents(students =>
//         students.map(student =>
//           student.id === studentId
//             ? {
//                 ...student,
//                 subjects: student.subjects.filter(sub => sub.id !== subjectId)
//               }
//             : student
//         )
//       );
//       alert("Removed from subject.");
//     } catch (err) {
//       alert("Error removing from subject: " + (err.response?.data?.message || err.message));
//     }
//   }

//   // Fully delete the user (all subjects, as before)
//   async function handleDeleteStudent(studentId) {
//     if (!window.confirm('Are you sure you want to delete this student? This will remove them from all subjects.')) return;
//     setDeleteLoading(studentId);
//     try {
//       await axios.delete(
//         `${API_BASE_URL}/admin/student/${studentId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setStudents(students => students.filter(student => student.id !== studentId));
//       alert('Student deleted successfully');
//     } catch (err) {
//       alert('Error deleting student: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setDeleteLoading(null);
//     }
//   }

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;
//   if (students.length === 0) return <div>No students found.</div>;

//   return (
//     <div>
//       <h2>All Students</h2>
//       <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
//         <thead>
//           <tr>
//             <th>Student Name</th>
//             <th>Enrolled Subjects</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map(student => (
//             <tr key={student.id}>
//               <td>{student.name}</td>
//               <td>
//                 {student.subjects.length === 0
//                   ? 'None'
//                   : student.subjects.map(sub => (
//                       <span key={sub.id} style={{ marginRight: 8 }}>
//                         {sub.name}
//                         <button
//                           onClick={() => handleRemoveFromSubject(student.id, sub.id)}
//                           style={{
//                             marginLeft: '4px',
//                             fontSize: '12px',
//                             background: '#900',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '3px',
//                             padding: '2px 5px',
//                             cursor: 'pointer'
//                           }}
//                         >Remove</button>
//                         {','}
//                       </span>
//                     ))}
//               </td>
//               <td>
//                 <button
//                   onClick={() => handleDeleteStudent(student.id)}
//                   disabled={deleteLoading === student.id}
//                   style={{
//                     backgroundColor: '#ff4444',
//                     color: 'white',
//                     border: 'none',
//                     padding: '5px 10px',
//                     borderRadius: '4px',
//                     cursor: deleteLoading === student.id ? 'not-allowed' : 'pointer'
//                   }}
//                 >
//                   {deleteLoading === student.id ? 'Deleting...' : 'Delete User'}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default StudentsList;


import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api.js';

function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const { token } = useContext(AuthContext);

  // Fetch students and their subject enrollments
  const fetchStudentsDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/subjects/admin/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
      setError('');
    } catch (err) {
      setError('Error fetching students details: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStudentsDetails();
  }, [token]);

  // Remove a student from a specific subject
  async function handleRemoveFromSubject(studentId, subjectId, studentName, subjectName) {
    if (!window.confirm(`Remove ${studentName} from "${subjectName}"?`)) return;
    
    try {
      setRemoveLoading(`${studentId}-${subjectId}`);
      await axios.post(
        `${API_BASE_URL}/admin/remove-student-from-subject`,
        { studentId, subjectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update state locally
      setStudents(students =>
        students.map(student =>
          student.id === studentId
            ? {
                ...student,
                subjects: student.subjects.filter(sub => sub.id !== subjectId)
              }
            : student
        )
      );
      setSuccess(`Successfully removed ${studentName} from ${subjectName}`);
      setError('');
    } catch (err) {
      setError("Error removing from subject: " + (err.response?.data?.message || err.message));
    } finally {
      setRemoveLoading(null);
    }
  }

  // Fully delete the user
  async function handleDeleteStudent(studentId, studentName) {
    if (!window.confirm(`Are you sure you want to delete ${studentName}? This will permanently remove them from the system and all enrolled subjects.`)) return;
    
    setDeleteLoading(studentId);
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/student/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(students => students.filter(student => student.id !== studentId));
      setSuccess(`Student "${studentName}" deleted successfully`);
      setError('');
    } catch (err) {
      setError('Error deleting student: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleteLoading(null);
    }
  }

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      await fetchStudentsDetails();
      setSuccess('Students data refreshed successfully!');
    } catch (err) {
      setError('Failed to refresh students data');
    }
  };

  // Get unique subjects for filtering
  const allSubjects = [...new Set(students.flatMap(student => 
    student.subjects.map(sub => sub.name)
  ))];

  // Filter students based on search and subject filter
  const filteredStudents = students.filter(student => {
    // Search filter
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Subject filter
    const matchesSubject = filterSubject === 'all' || 
                          student.subjects.some(sub => sub.name === filterSubject);
    
    return matchesSearch && matchesSubject;
  });

  // Calculate statistics
  const totalStudents = students.length;
  const enrolledStudents = students.filter(student => student.subjects.length > 0).length;
  const averageSubjects = students.length > 0 
    ? (students.reduce((sum, student) => sum + student.subjects.length, 0) / students.length).toFixed(1)
    : 0;

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '1.1rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-light)',
          borderTop: '3px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginRight: '1rem'
        }}></div>
        Loading students...
      </div>
    );
  }

  if (error && students.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        color: 'var(--error)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ margin: '0 0 1rem 0' }}>Error Loading Students</h3>
        <p style={{ margin: '0 0 2rem 0' }}>{error}</p>
        <button
          onClick={refreshData}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem'
          }}>
            <span style={{ color: 'white', fontSize: '1.5rem' }}>🎓</span>
          </div>
          <div>
            <h1 style={{ 
              margin: '0 0 0.5rem 0', 
              color: 'var(--text-primary)',
              fontSize: '1.8rem'
            }}>
              Manage Students
            </h1>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)',
              fontSize: '1rem'
            }}>
              View and manage student enrollments and accounts
            </p>
          </div>
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Loading...
            </>
          ) : (
            <>
              <span>🔄</span>
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>👥</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{totalStudents}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Students</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }}>📚</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{enrolledStudents}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enrolled Students</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--info)', marginBottom: '0.5rem' }}>📊</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{averageSubjects}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Avg Subjects</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr auto',
        gap: '1rem',
        marginBottom: '1.5rem',
        alignItems: 'end'
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            fontWeight: '500'
          }}>
            Search Students
          </label>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            fontWeight: '500'
          }}>
            Filter by Subject
          </label>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Subjects</option>
            {allSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setSearchTerm('');
            setFilterSubject('all');
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--secondary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: 'var(--error)',
          color: 'white',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <span style={{ marginRight: '0.5rem' }}>⚠️</span>
          <div>{error}</div>
        </div>
      )}
      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: 'var(--success)',
          color: 'white',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <span style={{ marginRight: '0.5rem' }}>✅</span>
          <div>{success}</div>
        </div>
      )}

      {/* Students Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: 'var(--primary)',
          color: 'white',
          padding: '1.5rem'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
            📋 Students List ({filteredStudents.length})
          </h3>
        </div>
        
        <div style={{ padding: '0' }}>
          {filteredStudents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>No Students Found</h4>
              <p style={{ margin: 0 }}>
                {searchTerm || filterSubject !== 'all' 
                  ? 'No students match your current filters.' 
                  : 'No students available in the system.'
                }
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                minWidth: '800px'
              }}>
                <thead style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  borderBottom: '2px solid var(--border-light)'
                }}>
                  <tr>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      border: 'none'
                    }}>Student Information</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      border: 'none'
                    }}>Enrolled Subjects</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      border: 'none'
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} style={{ 
                      borderBottom: '1px solid var(--border-light)',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '1rem'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: 'var(--primary)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '1rem'
                          }}>
                            {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <div style={{ 
                              color: 'var(--text-primary)', 
                              fontWeight: '500',
                              fontSize: '1.1rem',
                              marginBottom: '0.25rem'
                            }}>
                              {student.name}
                            </div>
                            {student.email && (
                              <div style={{ 
                                fontSize: '0.875rem', 
                                color: 'var(--text-secondary)',
                                marginBottom: '0.25rem'
                              }}>
                                {student.email}
                              </div>
                            )}
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: 'var(--text-secondary)'
                            }}>
                              ID: {student.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {student.subjects.length === 0 ? (
                          <span style={{ 
                            color: 'var(--text-secondary)', 
                            fontStyle: 'italic',
                            fontSize: '0.875rem'
                          }}>
                            No enrolled subjects
                          </span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {student.subjects.map((subject) => (
                              <div key={subject.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem 0.75rem',
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: '6px',
                                fontSize: '0.875rem'
                              }}>
                                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                                  {subject.name}
                                  {subject.classCode && (
                                    <span style={{ 
                                      color: 'var(--text-secondary)',
                                      marginLeft: '0.5rem',
                                      fontSize: '0.75rem'
                                    }}>
                                      ({subject.classCode})
                                    </span>
                                  )}
                                </span>
                                <button
                                  onClick={() => handleRemoveFromSubject(student.id, subject.id, student.name, subject.name)}
                                  disabled={removeLoading === `${student.id}-${subject.id}`}
                                  style={{
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: removeLoading === `${student.id}-${subject.id}` ? 'var(--secondary)' : 'var(--error)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: removeLoading === `${student.id}-${subject.id}` ? 'not-allowed' : 'pointer',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    opacity: removeLoading === `${student.id}-${subject.id}` ? 0.7 : 1
                                  }}
                                >
                                  {removeLoading === `${student.id}-${subject.id}` ? (
                                    <div style={{
                                      width: '10px',
                                      height: '10px',
                                      border: '2px solid transparent',
                                      borderTop: '2px solid white',
                                      borderRadius: '50%',
                                      animation: 'spin 1s linear infinite'
                                    }}></div>
                                  ) : (
                                    '❌'
                                  )}
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                          <button
                            onClick={() => handleViewDetails(student)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: 'var(--info)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <span>👁️</span>
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id, student.name)}
                            disabled={deleteLoading === student.id}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: deleteLoading === student.id ? 'var(--secondary)' : 'var(--error)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: deleteLoading === student.id ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              opacity: deleteLoading === student.id ? 0.7 : 1
                            }}
                          >
                            {deleteLoading === student.id ? (
                              <div style={{
                                width: '12px',
                                height: '12px',
                                border: '2px solid transparent',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }}></div>
                            ) : (
                              '🗑️'
                            )}
                            Delete Student
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>🎓 Student Details</h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ padding: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1.5rem'
                }}>
                  {selectedStudent.name ? selectedStudent.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: 'var(--text-primary)',
                    fontSize: '1.5rem'
                  }}>
                    {selectedStudent.name}
                  </h3>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-secondary)'
                  }}>
                    Student ID: {selectedStudent.id}
                  </div>
                </div>
              </div>

              <div style={{ 
                backgroundColor: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem'
                }}>
                  Contact Information
                </h4>
                <div style={{ color: 'var(--text-secondary)' }}>
                  <p style={{ margin: '0 0 0.75rem 0' }}>
                    <strong>Email:</strong> {selectedStudent.email || 'N/A'}
                  </p>
                  {selectedStudent.department && (
                    <p style={{ margin: '0 0 0.75rem 0' }}>
                      <strong>Department:</strong> {selectedStudent.department}
                    </p>
                  )}
                  {selectedStudent.phone && (
                    <p style={{ margin: '0 0 0.75rem 0' }}>
                      <strong>Phone:</strong> {selectedStudent.phone}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem'
                }}>
                  Enrolled Subjects ({selectedStudent.subjects.length})
                </h4>
                {selectedStudent.subjects.length === 0 ? (
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    fontStyle: 'italic',
                    margin: 0
                  }}>
                    No enrolled subjects
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedStudent.subjects.map((subject) => (
                      <div key={subject.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'white',
                        border: '1px solid var(--border-light)',
                        borderRadius: '6px'
                      }}>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                            {subject.name}
                          </div>
                          {subject.classCode && (
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: 'var(--text-secondary)',
                              marginTop: '0.25rem'
                            }}>
                              Code: {subject.classCode}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveFromSubject(selectedStudent.id, subject.id, selectedStudent.name, subject.name)}
                          disabled={removeLoading === `${selectedStudent.id}-${subject.id}`}
                          style={{
                            padding: '0.375rem 0.75rem',
                            backgroundColor: removeLoading === `${selectedStudent.id}-${subject.id}` ? 'var(--secondary)' : 'var(--error)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: removeLoading === `${selectedStudent.id}-${subject.id}` ? 'not-allowed' : 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            opacity: removeLoading === `${selectedStudent.id}-${subject.id}` ? 0.7 : 1
                          }}
                        >
                          {removeLoading === `${selectedStudent.id}-${subject.id}` ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ 
                display: 'flex',
                gap: '1rem'
              }}>
                <button
                  onClick={() => handleDeleteStudent(selectedStudent.id, selectedStudent.name)}
                  disabled={deleteLoading === selectedStudent.id}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    backgroundColor: deleteLoading === selectedStudent.id ? 'var(--secondary)' : 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: deleteLoading === selectedStudent.id ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: deleteLoading === selectedStudent.id ? 0.7 : 1
                  }}
                >
                  {deleteLoading === selectedStudent.id ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  ) : (
                    '🗑️'
                  )}
                  Delete Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default StudentsList;