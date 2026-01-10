


// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const TeacherPendingRequests = () => {
//   const { token, user } = useContext(AuthContext);
//   const [requests, setRequests] = useState([]);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   console.log("User: ", user?.id);

//   const fetchRequests = async () => {
//     if (!token || !user || !user.id) return;
//     try {
//       // FIX: Changed user._id to user.id
//       const res = await axios.get(`${API_BASE_URL}/class-requests/teacher/${user.id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // No need to filter here if backend already returns correct status.
//       // But to be safe, filter here explicitly:
//       const filteredRequests = Array.isArray(res.data)
//         ? res.data.filter(r => r.status === 'pending' || r.status === 'rejected')
//         : [];
//       setRequests(filteredRequests);
//       setError('');
//     } catch (err) {
//       console.error('Error fetching requests:', err);
//       setError("Failed to load student requests");
//     }
//   };

//   useEffect(() => {
//     if (token && user && user.id) fetchRequests();
//   }, [token, user]);

//   const approveRequest = async (requestId) => {
//     try {
//       await axios.post(`${API_BASE_URL}/class-requests/${requestId}/approve`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMessage("Request approved and student assigned.");
//       fetchRequests();
//     } catch (err) {
//       console.error('Error approving request:', err);
//       setError("Failed to approve request.");
//     }
//   };

//   const rejectRequest = async (requestId) => {
//     try {
//       await axios.post(`${API_BASE_URL}/class-requests/${requestId}/reject`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMessage("Request rejected.");
//       fetchRequests();
//     } catch (err) {
//       console.error('Error rejecting request:', err);
//       setError("Failed to reject request.");
//     }
//   };

//   return (
//     <div>
//       <h2>Student Join Requests</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {message && <p style={{ color: 'green' }}>{message}</p>}
      
//       {/* Debug info */}
//       <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '14px' }}>
//         <strong>Debug Info:</strong> User ID: {user?.id || 'No user'}, Requests: {requests.length}
//       </div>

//       {requests.length === 0 ? (
//         <p>No pending or rejected requests.</p>
//       ) : (
//         <table border="1" cellPadding="6" cellSpacing="0" style={{ width: "100%" }}>
//           <thead>
//             <tr>
//               <th>Student</th>
//               <th>Class</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map((req) => (
//               <tr key={req._id}>
//                 <td>{req.student?.name || 'N/A'}</td>
//                 <td>{req.class?.name || 'N/A'}</td>
//                 <td>{req.status}</td>
//                 <td>
//                   {req.status === 'pending' ? (
//                     <>
//                       <button onClick={() => approveRequest(req._id)}>Approve</button>
//                       <button onClick={() => rejectRequest(req._id)}>Reject</button>
//                     </>
//                   ) : (
//                     <em>Rejected</em>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default TeacherPendingRequests;

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api.js';

const TeacherPendingRequests = () => {
  const { token, user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, rejected

  const fetchRequests = async () => {
    if (!token || !user || !user.id) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/class-requests/teacher/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const filteredRequests = Array.isArray(res.data)
        ? res.data.filter(r => r.status === 'pending' || r.status === 'rejected')
        : [];
      setRequests(filteredRequests);
      setError('');
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError("Failed to load student requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user && user.id) fetchRequests();
  }, [token, user]);

  const approveRequest = async (requestId, studentName, className) => {
    try {
      setActionLoading(requestId);
      await axios.post(`${API_BASE_URL}/class-requests/${requestId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`Request from ${studentName} for ${className} approved successfully!`);
      setError('');
      fetchRequests();
    } catch (err) {
      console.error('Error approving request:', err);
      setError("Failed to approve request.");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectRequest = async (requestId, studentName, className) => {
    try {
      setActionLoading(requestId);
      await axios.post(`${API_BASE_URL}/class-requests/${requestId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`Request from ${studentName} for ${className} rejected.`);
      setError('');
      fetchRequests();
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError("Failed to reject request.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.375rem 0.75rem',
      borderRadius: '1.5rem',
      textTransform: 'capitalize'
    };

    switch (status) {
      case 'pending':
        return { ...baseStyle, backgroundColor: 'var(--warning)', color: 'var(--text-primary)' };
      case 'approved':
        return { ...baseStyle, backgroundColor: 'var(--success)', color: 'white' };
      case 'rejected':
        return { ...baseStyle, backgroundColor: 'var(--error)', color: 'white' };
      default:
        return { ...baseStyle, backgroundColor: 'var(--secondary)', color: 'white' };
    }
  };

  const refreshData = async () => {
    await fetchRequests();
    setSuccess('Requests data refreshed!');
  };

  // Filter requests based on selected filter
  const filteredRequests = requests.filter(request => 
    filter === 'all' || request.status === filter
  );

  // Calculate statistics
  const pendingCount = requests.filter(req => req.status === 'pending').length;
  const rejectedCount = requests.filter(req => req.status === 'rejected').length;
  const totalCount = requests.length;

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
            <span style={{ color: 'white', fontSize: '1.5rem' }}>👥</span>
          </div>
          <div>
            <h1 style={{ 
              margin: '0 0 0.5rem 0', 
              color: 'var(--text-primary)',
              fontSize: '1.8rem'
            }}>
              Student Join Requests
            </h1>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)',
              fontSize: '1rem'
            }}>
              Manage student requests to join your classes
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
          <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>📋</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{totalCount}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Requests</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--warning)', marginBottom: '0.5rem' }}>⏳</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{pendingCount}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pending</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--error)', marginBottom: '0.5rem' }}>❌</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{rejectedCount}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <label style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
          Filter by Status:
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid var(--border-light)',
            borderRadius: '6px',
            backgroundColor: 'white',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending Only</option>
          <option value="rejected">Rejected Only</option>
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

      {/* Requests Table */}
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
            📋 Student Requests ({filteredRequests.length})
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
          ) : filteredRequests.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>No Requests Found</h4>
              <p style={{ margin: 0 }}>
                {filter === 'all' 
                  ? "You don't have any student requests yet." 
                  : `No ${filter} requests found.`
                }
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                minWidth: '600px'
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
                    }}>Student</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      border: 'none'
                    }}>Class</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      border: 'none'
                    }}>Request Date</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      border: 'none'
                    }}>Status</th>
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
                  {filteredRequests.map((req) => (
                    <tr key={req._id} style={{ 
                      borderBottom: '1px solid var(--border-light)',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <td style={{ 
                        padding: '1rem',
                        color: 'var(--text-primary)',
                        fontWeight: '500'
                      }}>
                        {req.student?.name || 'N/A'}
                        {req.student?.email && (
                          <div style={{ 
                            fontSize: '0.875rem', 
                            color: 'var(--text-secondary)',
                            marginTop: '0.25rem'
                          }}>
                            {req.student.email}
                          </div>
                        )}
                      </td>
                      <td style={{ 
                        padding: '1rem',
                        color: 'var(--text-primary)'
                      }}>
                        <strong>{req.class?.name || 'N/A'}</strong>
                        {req.class?.classCode && (
                          <div style={{ 
                            fontSize: '0.875rem', 
                            color: 'var(--text-secondary)',
                            marginTop: '0.25rem'
                          }}>
                            Code: {req.class.classCode}
                          </div>
                        )}
                      </td>
                      <td style={{ 
                        padding: '1rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem'
                      }}>
                        {req.requestedAt ? new Date(req.requestedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={getStatusBadgeStyle(req.status)}>
                          {req.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {req.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => approveRequest(req._id, req.student?.name, req.class?.name)}
                              disabled={actionLoading === req._id}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--success)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: actionLoading === req._id ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                opacity: actionLoading === req._id ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              {actionLoading === req._id ? (
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
                              onClick={() => rejectRequest(req._id, req.student?.name, req.class?.name)}
                              disabled={actionLoading === req._id}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--error)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: actionLoading === req._id ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                opacity: actionLoading === req._id ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              {actionLoading === req._id ? (
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
                        ) : (
                          <span style={{ 
                            color: 'var(--text-secondary)', 
                            fontStyle: 'italic',
                            fontSize: '0.875rem'
                          }}>
                            Request rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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

export default TeacherPendingRequests;