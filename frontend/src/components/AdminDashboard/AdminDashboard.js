import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import ManageUsers from './ManageUsers';
import ManageSubjects from './ManageSubjects';
import Announcements from './Announcements';
import PublicInfoAdmin from '../PublicInfo/PublicInfoAdmin';

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    // Optionally, redirect user to login or home page here
    // e.g., navigate('/login') if you use react-router
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
       <button onClick={handleLogout} style={{ cursor: 'pointer', padding: '8px 16px' }}>
      Logout
    </button>
      <ManageUsers />
      <ManageSubjects />
      <Announcements />
      <PublicInfoAdmin/>
    </div>
  );
};

export default AdminDashboard;
