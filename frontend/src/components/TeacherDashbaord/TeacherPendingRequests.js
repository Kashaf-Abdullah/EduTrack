// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const TeacherPendingRequests = () => {
//   const { token, user } = useContext(AuthContext);
//   const [requests, setRequests] = useState([]);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
// console.log("User: ", user.id);

//   const fetchRequests = async () => {
//     if (!token || !user || !user.id) return;
//     try {
//       const res = await axios.get(`http://localhost:5000/api/class-requests/teacher/${user._id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       // No need to filter here if backend already returns correct status.
//       // But to be safe, filter here explicitly:
//       const filteredRequests = Array.isArray(res.data)
//         ? res.data.filter(r => r.status === 'pending' || r.status === 'rejected')
//         : [];
//       setRequests(filteredRequests);
//       setError('');
//     } catch {
//       setError("Failed to load student requests");
//     }
//   };

//   useEffect(() => {
//     if (token && user && user.id) fetchRequests();
//   }, [token, user]);

//   const approveRequest = async (requestId) => {
//     try {
//       await axios.post(`http://localhost:5000/api/class-requests/${requestId}/approve`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMessage("Request approved and student assigned.");
//       fetchRequests();
//     } catch {
//       setError("Failed to approve request.");
//     }
//   };

//   const rejectRequest = async (requestId) => {
//     try {
//       await axios.post(`http://localhost:5000/api/class-requests/${requestId}/reject`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMessage("Request rejected.");
//       fetchRequests();
//     } catch {
//       setError("Failed to reject request.");
//     }
//   };

//   return (
//     <div>
//       <h2>Student Join Requests</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {message && <p style={{ color: 'green' }}>{message}</p>}
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

const TeacherPendingRequests = () => {
  const { token, user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  console.log("User: ", user?.id);

  const fetchRequests = async () => {
    if (!token || !user || !user.id) return;
    try {
      // FIX: Changed user._id to user.id
      const res = await axios.get(`http://localhost:5000/api/class-requests/teacher/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // No need to filter here if backend already returns correct status.
      // But to be safe, filter here explicitly:
      const filteredRequests = Array.isArray(res.data)
        ? res.data.filter(r => r.status === 'pending' || r.status === 'rejected')
        : [];
      setRequests(filteredRequests);
      setError('');
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError("Failed to load student requests");
    }
  };

  useEffect(() => {
    if (token && user && user.id) fetchRequests();
  }, [token, user]);

  const approveRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:5000/api/class-requests/${requestId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Request approved and student assigned.");
      fetchRequests();
    } catch (err) {
      console.error('Error approving request:', err);
      setError("Failed to approve request.");
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:5000/api/class-requests/${requestId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Request rejected.");
      fetchRequests();
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError("Failed to reject request.");
    }
  };

  return (
    <div>
      <h2>Student Join Requests</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      
      {/* Debug info */}
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '14px' }}>
        <strong>Debug Info:</strong> User ID: {user?.id || 'No user'}, Requests: {requests.length}
      </div>

      {requests.length === 0 ? (
        <p>No pending or rejected requests.</p>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.student?.name || 'N/A'}</td>
                <td>{req.class?.name || 'N/A'}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === 'pending' ? (
                    <>
                      <button onClick={() => approveRequest(req._id)}>Approve</button>
                      <button onClick={() => rejectRequest(req._id)}>Reject</button>
                    </>
                  ) : (
                    <em>Rejected</em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherPendingRequests;