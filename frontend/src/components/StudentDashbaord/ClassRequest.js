


// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const ClassRequest = () => {
//   const { user, token } = useContext(AuthContext);

//   const [availableClasses, setAvailableClasses] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     if (!token || !user) return;

//     const fetchData = async () => {
//       try {
//         // Fetch all subjects (all classes)
//         const subjectsRes = await axios.get('http://localhost:5000/api/subjects', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // Fetch student's class requests (pending/rejected)
//         const requestsRes = await axios.get(`http://localhost:5000/api/class-requests/student/${user.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const requestedClassIds = requestsRes.data.map(req => req.class._id);

//         // Assume user.enrolledClasses is an array of class Ids student already enrolled in
//         const enrolledClassIds = user.enrolledClasses || [];

//         // Filter classes student can request: exclude enrolled + requested
//         const filteredClasses = subjectsRes.data.filter(
//           cls => !requestedClassIds.includes(cls.id) && !enrolledClassIds.includes(cls._id)
//         );

//         setAvailableClasses(filteredClasses);
//         setPendingRequests(requestsRes.data);
//         setError('');
//       } catch (err) {
//         setError('Failed to load classes or requests');
//       }
//     };

//     fetchData();
//   }, [token, user]);

//   const handleRequestClass = async (classId) => {
//     try {
//       await axios.post('http://localhost:5000/api/class-requests', 
//         { studentId: user.id, classId }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSuccess('Request sent successfully');
//       setError('');
//       setAvailableClasses(prev => prev.filter(c => c._id !== classId));
//     } catch (err) {
//       setError('Failed to send request');
//       setSuccess('');
//     }
//   };

//   return (
//     <div>
//       <h2>Request to Join Classes</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}

//       {availableClasses.length === 0 ? (
//         <p>No new classes available to request.</p>
//       ) : (
//         <ul>
//           {availableClasses.map((cls) => (
//             <li key={cls._id}>
//               {cls.name}{' '}
//               <button onClick={() => handleRequestClass(cls._id)}>Request to Join</button>
//             </li>
//           ))}
//         </ul>
//       )}

//       <h3>Pending/Rejected Requests</h3>
//       {pendingRequests.length === 0 ? (
//         <p>No pending or rejected requests.</p>
//       ) : (
//         <ul>
//           {pendingRequests.map((req) => (
//             <li key={req._id}>
//               {req.class.name} - Status: {req.status}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ClassRequest;



import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api.js';

const ClassRequest = () => {
  const { user, token } = useContext(AuthContext);
  const studentId = user?._id || user?.id;
  const [availableClasses, setAvailableClasses] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!token || !studentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all subjects (all classes)
        const subjectsRes = await axios.get(`${API_BASE_URL}/subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch student's class requests (pending/rejected)
        const requestsRes = await axios.get(`${API_BASE_URL}/class-requests/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const requestedClassIds = requestsRes.data.map(req => req.class._id);

        // Assume user.enrolledClasses is an array of class Ids student already enrolled in
        const enrolledClassIds = user.enrolledClasses || [];

        // Filter classes student can request: exclude enrolled + requested
        const filteredClasses = subjectsRes.data.filter(
          cls => !requestedClassIds.includes(cls.id) && !enrolledClassIds.includes(cls._id)
        );

        setAvailableClasses(filteredClasses);
        setPendingRequests(requestsRes.data);
        setError('');
      } catch (err) {
        setError('Failed to load classes or requests');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  const handleRequestClass = async (classId, className) => {
    try {
      setRequesting(true);
      await axios.post(`${API_BASE_URL}/class-requests`, 
        { studentId, classId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Request sent successfully for ${className}`);
      setError('');
      setAvailableClasses(prev => prev.filter(c => c._id !== classId));
      
      // Refresh pending requests
      const requestsRes = await axios.get(`${API_BASE_URL}/class-requests/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRequests(requestsRes.data);
    } catch (err) {
      setError('Failed to send request');
      setSuccess('');
    } finally {
      setRequesting(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.375rem 0.75rem',
      borderRadius: '1.5rem'
    };

    switch (status.toLowerCase()) {
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
    if (!token || !user) return;
    try {
      setLoading(true);
      const subjectsRes = await axios.get(`${API_BASE_URL}/subjects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const requestsRes = await axios.get(`${API_BASE_URL}/class-requests/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const requestedClassIds = requestsRes.data.map(req => req.class._id);
      const enrolledClassIds = user.enrolledClasses || [];

      const filteredClasses = subjectsRes.data.filter(
        cls => !requestedClassIds.includes(cls.id) && !enrolledClassIds.includes(cls._id)
      );

      setAvailableClasses(filteredClasses);
      setPendingRequests(requestsRes.data);
      setError('');
      setSuccess('Data refreshed successfully!');
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
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
                <span style={{ color: 'white', fontSize: '1.5rem' }}>🎯</span>
              </div>
              <div>
                <h1 className="h2 mb-1" style={{ color: 'var(--text-primary)' }}>
                  Class Enrollment
                </h1>
                <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                  Request to join new classes and track your requests
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

      <div className="row">
        {/* Available Classes Section */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header" style={{ backgroundColor: 'var(--trapper-keeper-green)', color: 'white' }}>
              <h5 className="card-title mb-0">
                <span style={{ marginRight: '0.5rem',color:'white' }}>📚</span>
                Available Classes
                <span className="badge bg-light text-dark ms-2">{availableClasses.length}</span>
              </h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : availableClasses.length === 0 ? (
                <div className="text-center py-4">
                  <div style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>🎉</div>
                  <h6 style={{ color: 'var(--text-secondary)' }}>No Available Classes</h6>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    You've requested all available classes or are already enrolled in them.
                  </p>
                </div>
              ) : (
                <div className="row">
                  {availableClasses.map((cls) => (
                    <div key={cls._id} className="col-12 mb-3">
                      <div 
                        className="p-3 rounded"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-light)'
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                              {cls.name}
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                              {cls.classCode && (
                                <span 
                                  style={{
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  Code: {cls.classCode}
                                </span>
                              )}
                              {cls.credits && (
                                <span 
                                  style={{
                                    backgroundColor: 'var(--info)',
                                    color: 'white',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  {cls.credits} Credits
                                </span>
                              )}
                            </div>
                            {cls.description && (
                              <p 
                                className="mt-2 mb-0"
                                style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}
                              >
                                {cls.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRequestClass(cls._id, cls.name)}
                            disabled={requesting}
                            className="btn d-flex align-items-center"
                            style={{
                              backgroundColor: 'var(--success)',
                              color: 'white',
                              border: 'none',
                              fontSize: '0.875rem'
                            }}
                          >
                            {requesting ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              <>
                                <span style={{ marginRight: '0.25rem' }}>📨</span>
                                Request
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Requests Section */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header" style={{ backgroundColor: 'var(--trapper-keeper-green)', color: 'white' }}>
              <h5 className="card-title mb-0">
                <span style={{ marginRight: '0.5rem' }}>⏳</span>
                Your Requests
                <span className="badge bg-light text-dark ms-2">{pendingRequests.length}</span>
              </h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-4">
                  <div style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>📭</div>
                  <h6 style={{ color: 'var(--text-secondary)' }}>No Requests</h6>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    You haven't made any class requests yet.
                  </p>
                </div>
              ) : (
                <div className="row">
                  {pendingRequests.map((req) => (
                    <div key={req._id} className="col-12 mb-3">
                      <div 
                        className="p-3 rounded"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-light)',
                          borderLeft: `4px solid ${getStatusBadgeStyle(req.status).backgroundColor}`
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                              {req.class.name}
                            </h6>
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                              <span style={getStatusBadgeStyle(req.status)}>
                                {req.status}
                              </span>
                              {req.class.classCode && (
                                <span 
                                  style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  Code: {req.class.classCode}
                                </span>
                              )}
                            </div>
                            {req.requestedAt && (
                              <p 
                                className="mt-2 mb-0"
                                style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}
                              >
                                Requested: {new Date(req.requestedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {req.status.toLowerCase() === 'rejected' && (
                            <button
                              onClick={() => handleRequestClass(req.class._id, req.class.name)}
                              disabled={requesting}
                              className="btn d-flex align-items-center"
                              style={{
                                backgroundColor: 'var(--warning)',
                                color: 'var(--text-primary)',
                                border: 'none',
                                fontSize: '0.75rem'
                              }}
                            >
                              <span style={{ marginRight: '0.25rem' }}>🔄</span>
                              Retry
                            </button>
                          )}
                        </div>
                        {req.feedback && (
                          <div 
                            className="mt-2 p-2 rounded"
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              fontSize: '0.875rem'
                            }}
                          >
                            <strong>Feedback:</strong> {req.feedback}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
            <div className="card-body py-3">
              <div className="row text-center">
                <div className="col-md-3">
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {availableClasses.length + pendingRequests.length}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Total Classes
                  </div>
                </div>
                <div className="col-md-3">
                  <div style={{ color: 'var(--warning)', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {pendingRequests.filter(req => req.status.toLowerCase() === 'pending').length}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Pending
                  </div>
                </div>
                <div className="col-md-3">
                  <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {pendingRequests.filter(req => req.status.toLowerCase() === 'approved').length}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Approved
                  </div>
                </div>
                <div className="col-md-3">
                  <div style={{ color: 'var(--error)', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {pendingRequests.filter(req => req.status.toLowerCase() === 'rejected').length}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Rejected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassRequest;