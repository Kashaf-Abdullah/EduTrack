


// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const ManageUsers = () => {
//   const { token } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/users/pending', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(res.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load users: ' + (err.response?.data?.message || err.message));
//         setLoading(false);
//       }
//     };
    
//     if (token) fetchUsers();
//   }, [token]);

//   const handleApprove = async (userId) => {
//     try {
//       await axios.put(`${API_BASE_URL}/users/approve/${userId}`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers((prev) => prev.filter((user) => user._id !== userId));
//     } catch (err) {
//       alert('Approval failed');
//     }
//   };

//   const handleReject = async (userId) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers((prev) => prev.filter((user) => user._id !== userId));
//     } catch (err) {
//       alert('Rejection failed');
//     }
//   };

//   if (loading) return <div className="loading">Loading users...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <section>
//       <h2>Manage Users</h2>
//       {users.length === 0 ? (
//         <div className="empty-state">
//           <p>No users pending approval.</p>
//         </div>
//       ) : (
//         <div className="users-list">
//           {users.map((user) => (
//             <div key={user._id} className="user-item" style={{ 
//               padding: '15px', 
//               border: '1px solid #e0e0e0', 
//               borderRadius: '8px', 
//               marginBottom: '10px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}>
//               <div className="user-info">
//                 <h4 style={{ margin: '0 0 5px 0' }}>{user.name}</h4>
//                 <p style={{ margin: '0 0 5px 0', color: '#666' }}>{user.email}</p>
//                 <span className="user-role" style={{ 
//                   background: '#0db4b9', 
//                   color: 'white', 
//                   padding: '2px 8px', 
//                   borderRadius: '12px',
//                   fontSize: '0.8rem'
//                 }}>
//                   {user.role}
//                 </span>
//               </div>
//               <div className="action-buttons">
//                 <button 
//                   onClick={() => handleApprove(user._id)} 
//                   className="btn btn-primary"
//                 >
//                   Approve
//                 </button>
//                 <button 
//                   onClick={() => handleReject(user._id)} 
//                   className="btn btn-danger"
//                   style={{ marginLeft: '8px' }}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default ManageUsers;

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api.js';

const ManageUsers = () => {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all'); // all, students, teachers
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load users: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    if (token) fetchUsers();
  }, [token]);

  const handleApprove = async (userId, userName) => {
    try {
      setActionLoading(userId);
      await axios.put(`${API_BASE_URL}/users/approve/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      setSuccess(`User "${userName}" approved successfully!`);
      setError('');
    } catch (err) {
      setError('Approval failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to reject ${userName}'s registration? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(userId);
      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      setSuccess(`User "${userName}" rejected successfully!`);
      setError('');
    } catch (err) {
      setError('Rejection failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/users/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setSuccess('Users data refreshed successfully!');
      setError('');
    } catch (err) {
      setError('Failed to refresh users data');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeStyle = (role) => {
    const baseStyle = {
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.375rem 0.75rem',
      borderRadius: '1.5rem',
      textTransform: 'capitalize'
    };

    switch (role) {
      case 'student':
        return { ...baseStyle, backgroundColor: 'var(--success)', color: 'white' };
      case 'teacher':
        return { ...baseStyle, backgroundColor: 'var(--info)', color: 'white' };
      case 'admin':
        return { ...baseStyle, backgroundColor: 'var(--primary)', color: 'white' };
      default:
        return { ...baseStyle, backgroundColor: 'var(--secondary)', color: 'white' };
    }
  };

  const getStatusBadgeStyle = (status) => {
    return {
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.375rem 0.75rem',
      borderRadius: '1.5rem',
      backgroundColor: 'var(--warning)',
      color: 'var(--text-primary)'
    };
  };

  // Filter users based on role
  const filteredUsers = users.filter(user => 
    filter === 'all' || user.role === filter
  );

  // Calculate statistics
  const totalUsers = users.length;
  const studentCount = users.filter(user => user.role === 'student').length;
  const teacherCount = users.filter(user => user.role === 'teacher').length;

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
      width: '100%',
      margin: '0',
      padding: '1rem 0',
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
            <span style={{ color: 'white', fontSize: '1.5rem' }}>👥</span>
          </div>
          <div>
            <h1 style={{ 
              margin: '0 0 0.5rem 0', 
              color: 'var(--text-primary)',
              fontSize: '1.8rem'
            }}>
              Manage User Approvals
            </h1>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)',
              fontSize: '1rem'
            }}>
              Review and approve pending user registrations
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
          <div style={{ fontSize: '2rem', color: 'var(--warning)', marginBottom: '0.5rem' }}>⏳</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{totalUsers}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pending Approvals</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }}>🎓</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{studentCount}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Students</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--info)', marginBottom: '0.5rem' }}>👨‍🏫</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{teacherCount}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Teachers</p>
        </div>
      </div>

      {/* Filter Section */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <label style={{ 
          color: 'var(--text-primary)', 
          fontWeight: '500',
          whiteSpace: 'nowrap'
        }}>
          Filter by Role:
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            backgroundColor: 'white',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            minWidth: '150px'
          }}
        >
          <option value="all">All Users</option>
          <option value="student">Students Only</option>
          <option value="teacher">Teachers Only</option>
        </select>
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

      {/* Users List */}
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
            📋 Pending User Approvals ({filteredUsers.length})
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
          ) : filteredUsers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>No Pending Approvals</h4>
              <p style={{ margin: 0 }}>
                {filter === 'all' 
                  ? "All user registrations have been processed." 
                  : `No ${filter} registrations pending approval.`
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
                    }}>User Information</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      border: 'none'
                    }}>Role & Status</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      border: 'none'
                    }}>Registration Date</th>
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
                  {filteredUsers.map((user) => (
                    <tr key={user._id} style={{ 
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
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div style={{ 
                              color: 'var(--text-primary)', 
                              fontWeight: '500',
                              fontSize: '1.1rem',
                              marginBottom: '0.25rem'
                            }}>
                              {user.name}
                            </div>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: 'var(--text-secondary)',
                              marginBottom: '0.25rem'
                            }}>
                              {user.email}
                            </div>
                            {user.department && (
                              <div style={{ 
                                fontSize: '0.875rem', 
                                color: 'var(--text-secondary)'
                              }}>
                                {user.department}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <span style={getRoleBadgeStyle(user.role)}>
                            {user.role}
                          </span>
                          <span style={getStatusBadgeStyle('pending')}>
                            Pending Approval
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ 
                          color: 'var(--text-secondary)',
                          fontSize: '0.875rem'
                        }}>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </div>
                        {user.createdAt && (
                          <div style={{ 
                            color: 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            marginTop: '0.25rem'
                          }}>
                            {new Date(user.createdAt).toLocaleTimeString()}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleViewDetails(user)}
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
                          <button
                            onClick={() => handleApprove(user._id, user.name)}
                            disabled={actionLoading === user._id}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: actionLoading === user._id ? 'var(--secondary)' : 'var(--success)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: actionLoading === user._id ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              opacity: actionLoading === user._id ? 0.7 : 1
                            }}
                          >
                            {actionLoading === user._id ? (
                              <div style={{
                                width: '12px',
                                height: '12px',
                                border: '2px solid transparent',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }}></div>
                            ) : (
                              '✅'
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(user._id, user.name)}
                            disabled={actionLoading === user._id}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: actionLoading === user._id ? 'var(--secondary)' : 'var(--error)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: actionLoading === user._id ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              opacity: actionLoading === user._id ? 0.7 : 1
                            }}
                          >
                            {actionLoading === user._id ? (
                              <div style={{
                                width: '12px',
                                height: '12px',
                                border: '2px solid transparent',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }}></div>
                            ) : (
                              '❌'
                            )}
                            Reject
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

      {/* User Details Modal */}
      {showModal && selectedUser && (
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
            maxWidth: '500px',
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
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>👤 User Details</h2>
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
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: 'var(--text-primary)',
                    fontSize: '1.5rem'
                  }}>
                    {selectedUser.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={getRoleBadgeStyle(selectedUser.role)}>
                      {selectedUser.role}
                    </span>
                    <span style={getStatusBadgeStyle('pending')}>
                      Pending Approval
                    </span>
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
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  {selectedUser.department && (
                    <p style={{ margin: '0 0 0.75rem 0' }}>
                      <strong>Department:</strong> {selectedUser.department}
                    </p>
                  )}
                  {selectedUser.phone && (
                    <p style={{ margin: '0 0 0.75rem 0' }}>
                      <strong>Phone:</strong> {selectedUser.phone}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-light)',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem'
              }}>
                <span>
                  <strong>Registered:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                </span>
                <span>
                  <strong>ID:</strong> {selectedUser._id}
                </span>
              </div>

              <div style={{ 
                display: 'flex',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                <button
                  onClick={() => handleApprove(selectedUser._id, selectedUser.name)}
                  disabled={actionLoading === selectedUser._id}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    backgroundColor: actionLoading === selectedUser._id ? 'var(--secondary)' : 'var(--success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: actionLoading === selectedUser._id ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: actionLoading === selectedUser._id ? 0.7 : 1
                  }}
                >
                  {actionLoading === selectedUser._id ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  ) : (
                    '✅'
                  )}
                  Approve User
                </button>
                <button
                  onClick={() => handleReject(selectedUser._id, selectedUser.name)}
                  disabled={actionLoading === selectedUser._id}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    backgroundColor: actionLoading === selectedUser._id ? 'var(--secondary)' : 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: actionLoading === selectedUser._id ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: actionLoading === selectedUser._id ? 0.7 : 1
                  }}
                >
                  {actionLoading === selectedUser._id ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  ) : (
                    '❌'
                  )}
                  Reject User
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
};

export default ManageUsers;