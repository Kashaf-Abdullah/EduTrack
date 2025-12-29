import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <h1 className="hero-title">
                Smart Attendance Management System
              </h1>
              <p className="hero-subtitle">
                Role-based MERN app with separate dashboards for Admin, Teachers, and Students. 
                Streamline your institute's attendance tracking with modern technology.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary me-3" onClick={handleGetStarted}>
                  Get Started
                </button>
                <button className="btn btn-outline-primary" onClick={handleDashboard}>
                  Go to Dashboard
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-graphic">
                <div className="floating-card admin-card">
                  <i className="fas fa-user-shield"></i>
                  <span>Admin</span>
                </div>
                <div className="floating-card teacher-card">
                  <i className="fas fa-chalkboard-teacher"></i>
                  <span>Teacher</span>
                </div>
                <div className="floating-card student-card">
                  <i className="fas fa-user-graduate"></i>
                  <span>Student</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="highlights-section py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-title">What This App Does</h2>
              <p className="section-subtitle">Comprehensive attendance management solution</p>
            </div>
          </div>
          <div className="row g-4">
            {[
              {
                icon: 'fas fa-users',
                title: 'Centralized Tracking',
                description: 'Centralized attendance tracking for all subjects and roles'
              },
              {
                icon: 'fas fa-user-lock',
                title: 'Role-Based Access',
                description: 'Secure role-based authentication and protected dashboards'
              },
              {
                icon: 'fas fa-qrcode',
                title: 'Unique Class Codes',
                description: 'Secure session-based attendance with unique codes'
              },
              {
                icon: 'fas fa-brain',
                title: 'Smart Logic',
                description: 'Intelligent sign-in/sign-out logic to prevent duplicates'
              },
              {
                icon: 'fas fa-chart-line',
                title: 'Real-time Analytics',
                description: 'Live status and history for students and classes'
              },
              {
                icon: 'fas fa-code',
                title: 'Modern Tech Stack',
                description: 'Built with MERN stack and JWT-based authentication'
              }
            ].map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className={feature.icon}></i>
                  </div>
                  <h5>{feature.title}</h5>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features by Role */}
      <section className="roles-section py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-title">Features by Role</h2>
              <p className="section-subtitle">Tailored experience for each user type</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="role-card admin-role">
                <div className="role-header">
                  <i className="fas fa-user-shield"></i>
                  <h4>Admin</h4>
                </div>
                <ul className="role-features">
                  <li>Create and manage subjects/classes with auto class codes</li>
                  <li>Assign teachers and manage enrolled students per subject</li>
                  <li>View system-wide attendance and subject data</li>
                  <li>Generate comprehensive reports and analytics</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="role-card teacher-role">
                <div className="role-header">
                  <i className="fas fa-chalkboard-teacher"></i>
                  <h4>Teacher</h4>
                </div>
                <ul className="role-features">
                  <li>Create/update subjects, class timings, and course content</li>
                  <li>Enroll/remove students from their subjects</li>
                  <li>View attendance per subject with student details</li>
                  <li>Manage class sessions and generate class codes</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="role-card student-role">
                <div className="role-header">
                  <i className="fas fa-user-graduate"></i>
                  <h4>Student</h4>
                </div>
                <ul className="role-features">
                  <li>See enrolled subjects with teacher and class code</li>
                  <li>One-click sign-in and sign-out per class</li>
                  <li>View personal attendance history and statistics</li>
                  <li>Track presence, dates, and session details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">Simple four-step process</p>
            </div>
          </div>
          <div className="row">
            {[
              {
                step: '1',
                title: 'Setup & Enrollment',
                description: 'Admin creates subjects and assigns teachers; students get enrolled in their courses'
              },
              {
                step: '2',
                title: 'Class Management',
                description: 'Teacher shares unique class code; students access their personalized dashboard'
              },
              {
                step: '3',
                title: 'Attendance Tracking',
                description: 'Students sign in/sign out from their dashboard; backend stores session data'
              },
              {
                step: '4',
                title: 'Analytics & Reports',
                description: 'Admin/teachers/students view comprehensive reports and history in their dashboards'
              }
            ].map((step, index) => (
              <div key={index} className="col-md-6 col-lg-3 mb-4">
                <div className="step-card">
                  <div className="step-number">{step.step}</div>
                  <h5>{step.title}</h5>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-section py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-title">Tech Stack</h2>
              <p className="section-subtitle">Built with modern technologies</p>
            </div>
          </div>
          <div className="row g-3 justify-content-center">
            {[
              { name: 'React', icon: 'fab fa-react' },
              { name: 'Node.js', icon: 'fab fa-node-js' },
              { name: 'Express', icon: 'fas fa-server' },
              { name: 'MongoDB', icon: 'fas fa-database' },
              { name: 'JWT', icon: 'fas fa-key' },
              { name: 'Axios', icon: 'fas fa-exchange-alt' },
              { name: 'Mongoose', icon: 'fas fa-leaf' },
              { name: 'Bootstrap', icon: 'fab fa-bootstrap' }
            ].map((tech, index) => (
              <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className="tech-card">
                  <i className={tech.icon}></i>
                  <span>{tech.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="row mt-4">
            <div className="col-12 text-center">
              <p className="tech-description">
                Fully RESTful APIs, protected routes, populated MongoDB relations (User–Subject–Attendance)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 text-white">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="mb-4">Ready to Transform Your Attendance Management?</h2>
              <p className="mb-4">
                Join educational institutions using our smart attendance system to streamline their processes.
              </p>
              <button className="btn btn-light btn-lg" onClick={handleGetStarted}>
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;