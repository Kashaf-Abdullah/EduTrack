// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const ManageUsers = () => {
//   const { token } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/users/pending', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(res.data);
//       } catch (err) {
//         setError('Failed to load users: ' + (err.response?.data?.message || err.message));
//       }
//     };
//     if (token) fetchUsers();
//   }, [token]);

//   if (error) return <p>{error}</p>;

//   return (
//     <section>
//       <h2>Manage Users</h2>
//       <ul>
//         {Array.isArray(users) && users.length > 0 ? (
//           users.map((user) => (
//             <li key={user._id}>
//               {user.name} ({user.email}) - Role: {user.role}
//             </li>
//           ))
//         ) : (
//           <p>No users found.</p>
//         )}
//       </ul>
//     </section>
//   );
// };

// export default ManageUsers;

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const ManageUsers = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load users: ' + (err.response?.data?.message || err.message));
      }
    };
    if (token) fetchUsers();
  }, [token]);

  const handleApprove = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/users/approve/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      alert('Approval failed');
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {  // Adjust backend route for rejection
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      alert('Rejection failed');
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <section>
      <h2>Manage Users</h2>
      {users.length === 0 ? (
        <p>No users pending approval.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} ({user.email}) - Role: {user.role}
              <button onClick={() => handleApprove(user._id)} style={{ marginLeft: '10px' }}>Approve</button>
              <button onClick={() => handleReject(user._id)} style={{ marginLeft: '5px', color: 'red' }}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ManageUsers;
