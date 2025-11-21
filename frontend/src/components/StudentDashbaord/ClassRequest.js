// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const ClassRequest = () => {
//   const { user, token } = useContext(AuthContext);

//   const [availableClasses, setAvailableClasses] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Fetch classes student can request (excluding ones enrolled or requested)
//   useEffect(() => {
//     if (!token || !user) return;

//     const fetchData = async () => {
//       try {
//         // 1. Fetch all subjects (all classes)
//         const subjectsRes = await axios.get('http://localhost:5000/api/subjects', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // 2. Fetch student's class requests (pending/rejected)
//         const requestsRes = await axios.get(`http://localhost:5000/api/class-requests/student/${user.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const requestedClassIds = requestsRes.data.map(req => req.class._id);

//         // 3. Fetch student's enrolled classes (from user or API)
//         // Assuming you have an API or user data for enrolled classes
//         // For example: user.enrolledClasses = [classIds...]
//         const enrolledClassIds = user.enrolledClasses || [];

//         // Filter classes student can request: exclude enrolled + requested
//         const filteredClasses = subjectsRes.data.filter(
//           cls => !requestedClassIds.includes(cls._id) && !enrolledClassIds.includes(cls._id)
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
//         { studentId: user._id, classId }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSuccess('Request sent successfully');
//       setError('');

//       setAvailableClasses(availableClasses.filter(c => c._id !== classId));
//       // Optionally add to pendingRequests by re-fetch or local update
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
//           {availableClasses.map(cls => (
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
//           {pendingRequests.map(req => (
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

const ClassRequest = () => {
  const { user, token } = useContext(AuthContext);

  const [availableClasses, setAvailableClasses] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token || !user) return;

    const fetchData = async () => {
      try {
        // Fetch all subjects (all classes)
        const subjectsRes = await axios.get('http://localhost:5000/api/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch student's class requests (pending/rejected)
        const requestsRes = await axios.get(`http://localhost:5000/api/class-requests/student/${user.id}`, {
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
      }
    };

    fetchData();
  }, [token, user]);

  const handleRequestClass = async (classId) => {
    try {
      await axios.post('http://localhost:5000/api/class-requests', 
        { studentId: user.id, classId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Request sent successfully');
      setError('');
      setAvailableClasses(prev => prev.filter(c => c._id !== classId));
    } catch (err) {
      setError('Failed to send request');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Request to Join Classes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {availableClasses.length === 0 ? (
        <p>No new classes available to request.</p>
      ) : (
        <ul>
          {availableClasses.map((cls) => (
            <li key={cls._id}>
              {cls.name}{' '}
              <button onClick={() => handleRequestClass(cls._id)}>Request to Join</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Pending/Rejected Requests</h3>
      {pendingRequests.length === 0 ? (
        <p>No pending or rejected requests.</p>
      ) : (
        <ul>
          {pendingRequests.map((req) => (
            <li key={req._id}>
              {req.class.name} - Status: {req.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClassRequest;
