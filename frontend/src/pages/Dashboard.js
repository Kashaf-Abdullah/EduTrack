
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DashboardLayout from '../components/Layout/DashboardLayout';
import AdminDashboard from '../components/AdminDashboard/AdminDashboard';
import TeacherDashboard from '../components/TeacherDashbaord/TeacherDashboard';
import StudentDashboard from '../components/StudentDashbaord/StudentDashboard';
import ManageUsers from '../components/AdminDashboard/ManageUsers';
import ManageSubjects from '../components/AdminDashboard/ManageSubjects';
import ManagePendingSubjects from '../components/AdminDashboard/ManagePendingSubjects';
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
import PublicInfoAdmin from '../components/PublicInfo/PublicInfoAdmin';

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
    case '/dashboard/admin/pending-subjects':
      return <ManagePendingSubjects />;
    case '/dashboard/admin/students':
      return <StudentsList />;
    case '/dashboard/admin/announcements':
      return <Announcements />;
    case '/dashboard/admin/public-info':
      return <PublicInfoAdmin />;
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
    //   <div className="login-prompt">
    //     <p>Please log in to access dashboard.</p>
    //     <button onClick={() => navigate('/login')}>Login</button>
    //   </div>
    <>
      <div className="container mt-5">
  <div className="row justify-content-center">
    <div className="col-md-6 col-lg-4">
      <div className="card shadow text-center">
        <div className="card-body p-5">
          <div className="mb-4">
            <i className="fas fa-lock fa-3x text-primary mb-3"></i>
            <h3 className="card-title">Access Required</h3>
            <p className="text-muted">Please log in to access your dashboard</p>
          </div>
          <button 
            className="btn btn-primary btn-lg w-100 mb-3"
            onClick={() => navigate('/login')}
          >
            <i className="fas fa-sign-in-alt me-2"></i>
            Login to Dashboard
          </button>
          <p className="text-muted small mb-0">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-decoration-none fw-semibold"
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
    </>
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