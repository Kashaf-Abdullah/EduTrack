import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const AdminApproveUsers = () => {
  const { token } = useContext(AuthContext);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        // Assuming backend route to get users pending approval
        const res = await axios.get('http://localhost:5000/api/users/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingUsers(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pending users');
        setLoading(false);
      }
    };
    fetchPendingUsers();
  }, [token]);

  const handleApprove = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/approve/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Remove approved user from list
      setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
      alert('User approved successfully');
    } catch (err) {
      alert('Approval failed');
    }
  };

  if (loading) return <p>Loading pending users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h2>Approve Users</h2>
      {pendingUsers.length === 0 ? (
        <p>No pending users to approve</p>
      ) : (
        <ul>
          {pendingUsers.map((user) => (
            <li key={user._id}>
              {user.name} ({user.email}) - Role: {user.role}{' '}
              <button onClick={() => handleApprove(user._id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AdminApproveUsers;
