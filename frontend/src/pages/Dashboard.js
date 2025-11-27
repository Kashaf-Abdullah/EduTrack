
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DashboardLayout from '../components/Layout/DashboardLayout';
import AdminDashboard from '../components/AdminDashboard/AdminDashboard';
import TeacherDashboard from '../components/TeacherDashbaord/TeacherDashboard';
import StudentDashboard from '../components/StudentDashbaord/StudentDashboard';
import ManageUsers from '../components/AdminDashboard/ManageUsers';
import ManageSubjects from '../components/AdminDashboard/ManageSubjects';
import Announcements from '../components/AdminDashboard/Announcements';
import StudentsList from '../components/AdminDashboard/StudentsList';
import Attendance from '../components/TeacherDashbaord/Attendance';
import AttendanceView from '../components/TeacherDashbaord/AttendanceView';
import Results from '../components/TeacherDashbaord/Results';
import SubjectCreate from '../components/TeacherDashbaord/SubjectCreate';
import AssignResult from '../components/TeacherDashbaord/AssignResult';
import TeacherPendingRequests from '../components/TeacherDashbaord/TeacherPendingRequests';
import Announcement from '../components/StudentDashbaord/Announcement';
import PublicInfo from '../components/StudentDashbaord/PublicInfo';
import ViewAttendance from '../components/StudentDashbaord/ViewAttendance';
import ViewResults from '../components/StudentDashbaord/ViewResults';
import ClassRequest from '../components/StudentDashbaord/ClassRequest';
import StudentAttendance from '../components/StudentDashbaord/StudentMarkAttendance';

// Admin sub-components
const AdminDashboardContent = () => {
  const location = useLocation();
  
  switch(location.pathname) {
    case '/dashboard':
      return <AdminDashboard />;
    case '/dashboard/admin/users':
      return <ManageUsers />;
    case '/dashboard/admin/subjects':
      return <ManageSubjects />;
    case '/dashboard/admin/students':
      return <StudentsList />;
    case '/dashboard/admin/announcements':
      return <Announcements />;
    case '/dashboard/admin/public-info':
      return (
        <div className="dashboard-header">
          <h1>Public Information</h1>
          <p>Manage public information and settings</p>
        </div>
      );
    default:
      return <AdminDashboard />;
  }
};
// Dashboard.js - Update the TeacherDashboardContent section
const TeacherDashboardContent = () => {
  const location = useLocation();
  
  switch(location.pathname) {
    case '/dashboard/teacher/attendance':
      return <Attendance />;
    case '/dashboard/teacher/attendance-view':
      return <AttendanceView />;
    case '/dashboard/teacher/results':
      return <Results />;
    case '/dashboard/teacher/subject-create':
      return <SubjectCreate />;
    case '/dashboard/teacher/assign-result':
      return <AssignResult />;
    case '/dashboard/teacher/pending-requests':
      return <TeacherPendingRequests />;
    case '/dashboard/teacher':
    case '/dashboard':
    default:
      return <TeacherDashboard />;
  }}

 const StudentDashboardContent = () => {
  const location = useLocation();
  
  switch(location.pathname) {
    case '/dashboard/student/announcements':
      return <Announcement />;
    case '/dashboard/student/public-info':
      return <PublicInfo />;
    case '/dashboard/student/view-attendance':
      return <ViewAttendance />;
    case '/dashboard/student/view-results':
      return <ViewResults />;
    case '/dashboard/student/class-request':
      return <ClassRequest />;
    case '/dashboard/student/mark-attendance':
      return <StudentAttendance />;
    case '/dashboard/student':
    case '/dashboard':
    default:
      return <StudentDashboard />;
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="login-prompt">
        <p>Please log in to access dashboard.</p>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    );
  }

  const renderContent = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboardContent />;
      case 'teacher':
        return <TeacherDashboardContent />;
      case 'student':
        return <StudentDashboardContent />;
      default:
        return <div>Unauthorized: Role not recognized</div>;
    }
  };

  return (
    <DashboardLayout user={user}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;