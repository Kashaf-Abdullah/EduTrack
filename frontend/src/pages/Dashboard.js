import React from 'react';
import useAuth from '../hooks/useAuth';
import AdminDashboard from '../components/AdminDashboard/AdminDashboard';
import TeacherDashboard from '../components/TeacherDashbaord/TeacherDashboard';
// import TeacherDashboard from '../components/TeacherDashboard/TeacherDashboard';
// import StudentDashboard from '../components/StudentDashboard/StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <div>Please log in to access dashboard.</div>;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    // case 'student':
    //   return <StudentDashboard />;
    default:
      return <div>Unauthorized: Role not recognized</div>;
  }
};

export default Dashboard;
