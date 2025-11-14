import React from 'react';
import ManageUsers from './ManageUsers';
import ManageSubjects from './ManageSubjects';
import Announcements from './Announcements';
import PublicInfoAdmin from '../PublicInfo/PublicInfoAdmin';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ManageUsers />
      <ManageSubjects />
      <Announcements />
      <PublicInfoAdmin/>
    </div>
  );
};

export default AdminDashboard;
