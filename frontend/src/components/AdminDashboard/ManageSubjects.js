

// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const ManageSubjects = () => {
//   const { token } = useContext(AuthContext);
//   const [subjects, setSubjects] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/subjects', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSubjects(res.data);
//       } catch (err) {
//         setError('Failed to load subjects: ' + (err.response?.data?.message || err.message));
//       }
//     };
//     if (token) fetchSubjects();
//   }, [token]);

//   if (error) return <p>{error}</p>;

//   return (
//     <section>
//       <h2>Manage Subjects</h2>
//       {subjects.length === 0 ? (
//         <p>No subjects found.</p>
//       ) : (
//         <ul>
//           {subjects.map((subject) => (
//             <li key={subject._id}>
//               {subject.name} (Teacher: {subject.teacher?.name || subject.teacher?._id || 'N/A'})
//             </li>
//           ))}
//         </ul>
//       )}
//     </section>
//   );
// };

// export default ManageSubjects;


import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api.js';

const ManageSubjects = () => {
  const { token, user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, my-subjects, other-subjects
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load subjects: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchSubjects();
  }, [token]);

  const handleViewDetails = (subject) => {
    setSelectedSubject(subject);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubject(null);
  };

  const handleDeleteSubject = async (subjectId, subjectName) => {
    if (!window.confirm(`Are you sure you want to delete "${subjectName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Subject "${subjectName}" deleted successfully!`);
      setError('');
      // Refresh the list
      const res = await axios.get(`${API_BASE_URL}/subjects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    } catch (err) {
      setError('Failed to delete subject: ' + (err.response?.data?.message || err.message));
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/subjects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
      setSuccess('Subjects data refreshed successfully!');
      setError('');
    } catch (err) {
      setError('Failed to refresh subjects');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search subjects
  const filteredSubjects = subjects.filter(subject => {
    // Filter by ownership
    const isMySubject = subject.teacher === user?.id || (subject.teacher && subject.teacher._id === user?.id);
    if (filter === 'my-subjects' && !isMySubject) return false;
    if (filter === 'other-subjects' && isMySubject) return false;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        subject.name.toLowerCase().includes(searchLower) ||
        (subject.classCode && subject.classCode.toLowerCase().includes(searchLower)) ||
        (subject.description && subject.description.toLowerCase().includes(searchLower)) ||
        (subject.teacher?.name && subject.teacher.name.toLowerCase().includes(searchLower)) ||
        (subject.department && subject.department.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Calculate statistics
  const totalSubjects = subjects.length;
  const mySubjects = subjects.filter(subject => 
    subject.teacher === user?.id || (subject.teacher && subject.teacher._id === user?.id)
  ).length;
  const otherSubjects = totalSubjects - mySubjects;

  const getTeacherBadgeStyle = (subject) => {
    const isMySubject = subject.teacher === user?.id || (subject.teacher && subject.teacher._id === user?.id);
    return {
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.375rem 0.75rem',
      borderRadius: '1.5rem',
      backgroundColor: isMySubject ? 'var(--success)' : 'var(--info)',
      color: 'white'
    };
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
            <span style={{ color: 'white', fontSize: '1.5rem' }}>📚</span>
          </div>
          <div>
            <h1 style={{ 
              margin: '0 0 0.5rem 0', 
              color: 'var(--text-primary)',
              fontSize: '1.8rem'
            }}>
              Manage Subjects
            </h1>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)',
              fontSize: '1rem'
            }}>
              View and manage all subjects in the system
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
          <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>📚</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{totalSubjects}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Subjects</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }}>👨‍🏫</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{mySubjects}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>My Subjects</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--info)', marginBottom: '0.5rem' }}>👥</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{otherSubjects}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Other Subjects</p>
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
            Filter by Ownership
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
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
            <option value="my-subjects">My Subjects Only</option>
            <option value="other-subjects">Other Subjects Only</option>
          </select>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            fontWeight: '500'
          }}>
            Search Subjects
          </label>
          <input
            type="text"
            placeholder="Search by name, code, description..."
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

        <button
          onClick={() => {
            setFilter('all');
            setSearchTerm('');
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

      {/* Subjects List */}
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
            📋 All Subjects ({filteredSubjects.length})
          </h3>
        </div>
        
        <div style={{ padding: '0' }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '3rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border-light)',
                borderTop: '3px solid var(--primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>No Subjects Found</h4>
              <p style={{ margin: 0 }}>
                {searchTerm || filter !== 'all' 
                  ? 'No subjects match your current filters.' 
                  : 'No subjects available in the system.'
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
                    }}>Subject</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      border: 'none'
                    }}>Teacher</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      border: 'none'
                    }}>Details</th>
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
                  {filteredSubjects.map((subject) => {
                    const isMySubject = subject.teacher === user?.id || (subject.teacher && subject.teacher._id === user?.id);
                    
                    return (
                      <tr key={subject._id} style={{ 
                        borderBottom: '1px solid var(--border-light)',
                        transition: 'background-color 0.2s ease'
                      }}>
                        <td style={{ padding: '1rem' }}>
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
                          {subject.credits && (
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: 'var(--text-secondary)',
                              marginTop: '0.25rem'
                            }}>
                              Credits: {subject.credits}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={getTeacherBadgeStyle(subject)}>
                            {isMySubject ? 'Me' : (subject.teacher?.name || 'N/A')}
                          </span>
                          {subject.teacher?.email && !isMySubject && (
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: 'var(--text-secondary)',
                              marginTop: '0.25rem'
                            }}>
                              {subject.teacher.email}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {subject.department && (
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: 'var(--text-secondary)',
                              marginBottom: '0.25rem'
                            }}>
                              {subject.department}
                            </div>
                          )}
                          {subject.maxStudents && (
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: 'var(--text-secondary)'
                            }}>
                              Max Students: {subject.maxStudents}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => handleViewDetails(subject)}
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
                              View
                            </button>
                            {isMySubject && (
                              <button
                                onClick={() => handleDeleteSubject(subject._id, subject.name)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  backgroundColor: 'var(--error)',
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
                                <span>🗑️</span>
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Subject Details Modal */}
      {showModal && selectedSubject && (
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
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>📚 Subject Details</h2>
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
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  margin: '0 0 1rem 0', 
                  color: 'var(--text-primary)',
                  fontSize: '1.5rem'
                }}>
                  {selectedSubject.name}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={getTeacherBadgeStyle(selectedSubject)}>
                    {selectedSubject.teacher === user?.id || (selectedSubject.teacher && selectedSubject.teacher._id === user?.id) 
                      ? 'My Subject' 
                      : `Teacher: ${selectedSubject.teacher?.name || 'N/A'}`
                    }
                  </span>
                  {selectedSubject.classCode && (
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '1.5rem',
                      backgroundColor: 'var(--secondary)',
                      color: 'white'
                    }}>
                      Code: {selectedSubject.classCode}
                    </span>
                  )}
                </div>
              </div>

              {selectedSubject.description && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem'
                  }}>
                    Description
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                  }}>
                    {selectedSubject.description}
                  </p>
                </div>
              )}

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                {selectedSubject.credits && (
                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      Credits
                    </div>
                    <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                      {selectedSubject.credits}
                    </div>
                  </div>
                )}
                {selectedSubject.maxStudents && (
                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      Max Students
                    </div>
                    <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                      {selectedSubject.maxStudents}
                    </div>
                  </div>
                )}
                {selectedSubject.department && (
                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '1rem',
                    borderRadius: '8px',
                    gridColumn: 'span 2'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      Department
                    </div>
                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                      {selectedSubject.department}
                    </div>
                  </div>
                )}
              </div>

              {selectedSubject.courseContent && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem'
                  }}>
                    Course Content
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                  }}>
                    {selectedSubject.courseContent}
                  </p>
                </div>
              )}

              {selectedSubject.classTimings && selectedSubject.classTimings.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem'
                  }}>
                    Class Timings
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedSubject.classTimings.map((timing, index) => (
                      <div key={index} style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)'
                      }}>
                        <strong>{timing.day}</strong>: {timing.startTime} - {timing.endTime}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ 
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-light)',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem'
              }}>
                <strong>Subject ID:</strong> {selectedSubject._id}
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
};

export default ManageSubjects;