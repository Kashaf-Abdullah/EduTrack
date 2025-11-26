


import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const ManageUsers = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load users: ' + (err.response?.data?.message || err.message));
        setLoading(false);
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
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      alert('Rejection failed');
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <section>
      <h2>Manage Users</h2>
      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users pending approval.</p>
        </div>
      ) : (
        <div className="users-list">
          {users.map((user) => (
            <div key={user._id} className="user-item" style={{ 
              padding: '15px', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div className="user-info">
                <h4 style={{ margin: '0 0 5px 0' }}>{user.name}</h4>
                <p style={{ margin: '0 0 5px 0', color: '#666' }}>{user.email}</p>
                <span className="user-role" style={{ 
                  background: '#0db4b9', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}>
                  {user.role}
                </span>
              </div>
              <div className="action-buttons">
                <button 
                  onClick={() => handleApprove(user._id)} 
                  className="btn btn-primary"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleReject(user._id)} 
                  className="btn btn-danger"
                  style={{ marginLeft: '8px' }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ManageUsers;