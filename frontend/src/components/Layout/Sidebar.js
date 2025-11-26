// import React from 'react';
// import './Sidebar.css';

// const Sidebar = ({ isOpen, onClose, user }) => {
//   const getMenuItems = () => {
//     const baseItems = [
//       { label: 'Dashboard', icon: '📊', path: '/dashboard' },
//     ];

//     if (user?.role === 'admin') {
//       return [
//         ...baseItems,
//         { label: 'Manage Users', icon: '👥', path: '#users' },
//         { label: 'Manage Subjects', icon: '📚', path: '#subjects' },
//         { label: 'Students', icon: '🎓', path: '#students' },
//         { label: 'Announcements', icon: '📢', path: '#announcements' },
//         { label: 'Public Info', icon: '🌐', path: '#public-info' },
//       ];
//     } else if (user?.role === 'teacher') {
//       return [
//         ...baseItems,
//         { label: 'My Subjects', icon: '📚', path: '#subjects' },
//         { label: 'Students', icon: '🎓', path: '#students' },
//         { label: 'Grades', icon: '📝', path: '#grades' },
//       ];
//     } else if (user?.role === 'student') {
//       return [
//         ...baseItems,
//         { label: 'My Subjects', icon: '📚', path: '#subjects' },
//         { label: 'Grades', icon: '📝', path: '#grades' },
//         { label: 'Announcements', icon: '📢', path: '#announcements' },
//       ];
//     }

//     return baseItems;
//   };

//   return (
//     <>
//       <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
//       <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
//         <div className="sidebar-header">
//           <h2 className="sidebar-logo">
//             <span style={{ color: '#0db4b9' }}>Edu</span>
//             <span style={{ color: '#e76d89' }}>Manage</span>
//           </h2>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>
        
//         <div className="user-info">
//           <div className="user-avatar" style={{ backgroundColor: '#e76d89' }}>
//             {user?.name?.charAt(0)?.toUpperCase() || 'U'}
//           </div>
//           <div className="user-details">
//             <h4>{user?.name || 'User'}</h4>
//             <span className="user-role">{user?.role || 'Role'}</span>
//           </div>
//         </div>

//         <nav className="sidebar-nav">
//           <ul>
//             {getMenuItems().map((item, index) => (
//               <li key={index}>
//                 <a href={item.path} className="nav-item">
//                   <span className="nav-icon">{item.icon}</span>
//                   <span className="nav-label">{item.label}</span>
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, user }) => {
  const getMenuItems = () => {
    const baseItems = [
      { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { label: 'Manage Users', icon: '👥', path: '#users' },
        { label: 'Manage Subjects', icon: '📚', path: '#subjects' },
        { label: 'Students', icon: '🎓', path: '#students' },
        { label: 'Announcements', icon: '📢', path: '#announcements' },
        { label: 'Public Info', icon: '🌐', path: '#public-info' },
      ];
    } else if (user?.role === 'teacher') {
      return [
        ...baseItems,
        { label: 'My Subjects', icon: '📚', path: '#subjects' },
        { label: 'Students', icon: '🎓', path: '#students' },
        { label: 'Grades', icon: '📝', path: '#grades' },
      ];
    } else if (user?.role === 'student') {
      return [
        ...baseItems,
        { label: 'My Subjects', icon: '📚', path: '#subjects' },
        { label: 'Grades', icon: '📝', path: '#grades' },
        { label: 'Announcements', icon: '📢', path: '#announcements' },
      ];
    }

    return baseItems;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">
            <span style={{ color: '#0db4b9' }}>Edu</span>
            <span style={{ color: '#e76d89' }}>Manage</span>
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="user-info">
          <div className="user-avatar" style={{ backgroundColor: '#e76d89' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h4>{user?.name || 'User'}</h4>
            <span className="user-role">{user?.role || 'Role'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {getMenuItems().map((item, index) => (
              <li key={index}>
                <a href={item.path} className="nav-item" onClick={() => window.innerWidth <= 768 && onClose()}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;