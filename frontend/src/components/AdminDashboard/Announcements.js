// import React, { useEffect, useState, useContext } from 'react';
// import { getAnnouncements, createAnnouncement } from '../api/announcementApi';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const Announcements = () => {
//   const { token } = useContext(AuthContext);
//   const [announcements, setAnnouncements] = useState([]);
//   const [users, setUsers] = useState([]); // Holds students and teachers
//   const [form, setForm] = useState({
//     type: 'best-student',
//     title: '',
//     description: '',
//     featuredUser: '',
//     visible: true,
//   });

//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       const data = await getAnnouncements();
//       setAnnouncements(data);
//     };

//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/users/approved', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(res.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     if (token) {
//       fetchAnnouncements();
//       fetchUsers();
//     }
//   }, [token]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createAnnouncement(form, token);
//       alert('Announcement created!');
//       setForm({
//         type: 'best-student',
//         title: '',
//         description: '',
//         featuredUser: '',
//         visible: true,
//       });
//       // Reload announcements list
//       const data = await getAnnouncements();
//       setAnnouncements(data);
//     } catch (error) {
//       alert('Error creating announcement: ' + error.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <section>
//       <h2>Manage Announcements</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Type:
//           <select name="type" value={form.type} onChange={handleChange}>
//             <option value="best-student">Best Student</option>
//             <option value="best-teacher">Best Teacher</option>
//           </select>
//         </label>
//         <br />
//         <label>
//           Title:
//           <input type="text" name="title" value={form.title} onChange={handleChange} required />
//         </label>
//         <br />
//         <label>
//           Description:
//           <textarea name="description" value={form.description} onChange={handleChange} />
//         </label>
//         <br />
//         <label>
//           Featured User:
//           <select name="featuredUser" value={form.featuredUser} onChange={handleChange} required>
//             <option value="">Select User</option>
//             {users.map((user) => (
//               <option key={user._id} value={user._id}>
//                 {user.name} ({user.role})
//               </option>
//             ))}
//           </select>
//         </label>
//         <br />
//         <label>
//           Visible:
//           <input type="checkbox" name="visible" checked={form.visible} onChange={handleChange} />
//         </label>
//         <br />
//         <button type="submit" disabled={!form.featuredUser}>Create Announcement</button>
//       </form>

//       <h3>Existing Announcements</h3>
//       <ul>
//         {announcements.map((announcement) => (
//           <li key={announcement._id}>
//             {announcement.title} ({announcement.type}) - Featured user: {announcement.featuredUser?.name || announcement.featuredUser}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// };

// export default Announcements;


import React, { useEffect, useState, useContext } from 'react';
import { getAnnouncements, createAnnouncement } from '../api/announcementApi';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api.js';

const Announcements = () => {
  const { token, user } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    type: 'best-student',
    title: '',
    description: '',
    featuredUser: '',
    visible: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const [announcementsData, usersData] = await Promise.all([
          getAnnouncements(),
          axios.get(`${API_BASE_URL}/users/approved`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        setAnnouncements(announcementsData);
        setUsers(usersData.data);
        setError('');
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load announcements and users');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.featuredUser) {
      setError('Please select a featured user');
      return;
    }

    try {
      setSubmitting(true);
      await createAnnouncement(form, token);
      setSuccess('Announcement created successfully!');
      setError('');
      
      // Reset form
      setForm({
        type: 'best-student',
        title: '',
        description: '',
        featuredUser: '',
        visible: true,
      });

      // Reload announcements
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      setError('Error creating announcement: ' + (error.response?.data?.message || error.message));
      setSuccess('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAnnouncement(null);
  };

  const getTypeBadgeStyle = (type) => {
    const baseStyle = {
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.375rem 0.75rem',
      borderRadius: '1.5rem',
      textTransform: 'capitalize'
    };

    switch (type) {
      case 'best-student':
        return { ...baseStyle, backgroundColor: 'var(--success)', color: 'white' };
      case 'best-teacher':
        return { ...baseStyle, backgroundColor: 'var(--info)', color: 'white' };
      case 'general':
        return { ...baseStyle, backgroundColor: 'var(--primary)', color: 'white' };
      case 'important':
        return { ...baseStyle, backgroundColor: 'var(--error)', color: 'white' };
      default:
        return { ...baseStyle, backgroundColor: 'var(--secondary)', color: 'white' };
    }
  };

  const getStatusBadgeStyle = (visible) => {
    return {
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.375rem 0.75rem',
      borderRadius: '1.5rem',
      backgroundColor: visible ? 'var(--success)' : 'var(--error)',
      color: 'white'
    };
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncements();
      setAnnouncements(data);
      setSuccess('Announcements refreshed successfully!');
      setError('');
    } catch (error) {
      setError('Failed to refresh announcements');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm({
      type: 'best-student',
      title: '',
      description: '',
      featuredUser: '',
      visible: true,
    });
    setError('');
  };

  // Filter users based on announcement type
  const filteredUsers = users.filter(user => {
    if (form.type === 'best-student') return user.role === 'student';
    if (form.type === 'best-teacher') return user.role === 'teacher';
    return true; // For other types, show all users
  });

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div style={{
      width: '100%',
      margin: '0',
      padding: '1rem 0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem'
          }}>
            <span style={{ color: 'white', fontSize: '1.5rem' }}>📢</span>
          </div>
          <div>
            <h1 style={{ 
              margin: '0 0 0.5rem 0', 
              color: 'var(--text-primary)',
              fontSize: '1.8rem'
            }}>
              Manage Announcements
            </h1>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)',
              fontSize: '1rem'
            }}>
              Create and manage announcements for students and teachers
            </p>
          </div>
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Loading...
            </>
          ) : (
            <>
              <span>🔄</span>
              Refresh
            </>
          )}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Create Announcement Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '1.5rem'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>➕ Create New Announcement</h2>
          </div>
          
          <div style={{ padding: '2rem' }}>
            {/* Alerts */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'var(--error)',
                color: 'white',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <span style={{ marginRight: '0.5rem' }}>⚠️</span>
                <div>{error}</div>
              </div>
            )}
            {success && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'var(--success)',
                color: 'white',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <span style={{ marginRight: '0.5rem' }}>✅</span>
                <div>{success}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}>
                  Announcement Type *
                </label>
                <select 
                  name="type" 
                  value={form.type} 
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="best-student">🏆 Best Student</option>
                  <option value="best-teacher">👨‍🏫 Best Teacher</option>
                  <option value="general">📢 General Announcement</option>
                  <option value="important">⚠️ Important Notice</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}>
                  Title *
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  required
                  placeholder="Enter announcement title"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}>
                  Description
                </label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter announcement description (optional)"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}>
                  Featured User *
                </label>
                <select 
                  name="featuredUser" 
                  value={form.featuredUser} 
                  onChange={handleChange} 
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select {form.type === 'best-student' ? 'Student' : form.type === 'best-teacher' ? 'Teacher' : 'User'}</option>
                  {filteredUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.role}) {user.email && `- ${user.email}`}
                    </option>
                  ))}
                </select>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--text-secondary)',
                  marginTop: '0.5rem'
                }}>
                  Showing {filteredUsers.length} {form.type === 'best-student' ? 'students' : form.type === 'best-teacher' ? 'teachers' : 'users'}
                </div>
              </div>

              <div style={{ 
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <input 
                  type="checkbox" 
                  name="visible" 
                  checked={form.visible} 
                  onChange={handleChange}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <label style={{
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Make announcement visible to users
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="submit" 
                  disabled={submitting || !form.featuredUser}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    backgroundColor: submitting || !form.featuredUser ? 'var(--secondary)' : 'var(--success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: submitting || !form.featuredUser ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: submitting || !form.featuredUser ? 0.7 : 1
                  }}
                >
                  {submitting ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <span>📢</span>
                      Create Announcement
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  onClick={clearForm}
                  style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: 'var(--secondary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Existing Announcements */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '1.5rem'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
              📋 Existing Announcements ({announcements.length})
            </h2>
          </div>
          
          <div style={{ padding: '0' }}>
            {loading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '3rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid var(--border-light)',
                  borderTop: '3px solid var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
            ) : announcements.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>No Announcements</h4>
                <p style={{ margin: 0 }}>Create your first announcement to get started</p>
              </div>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {announcements.map((announcement) => (
                  <div 
                    key={announcement._id}
                    style={{
                      padding: '1.5rem',
                      borderBottom: '1px solid var(--border-light)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={() => handleViewDetails(announcement)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem'
                    }}>
                      <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: 'var(--text-primary)',
                        fontSize: '1.1rem'
                      }}>
                        {announcement.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <span style={getTypeBadgeStyle(announcement.type)}>
                          {announcement.type.replace('-', ' ')}
                        </span>
                        <span style={getStatusBadgeStyle(announcement.visible)}>
                          {announcement.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                    
                    {announcement.description && (
                      <p style={{ 
                        margin: '0 0 0.75rem 0', 
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        lineHeight: '1.4'
                      }}>
                        {announcement.description.length > 100 
                          ? `${announcement.description.substring(0, 100)}...` 
                          : announcement.description
                        }
                      </p>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <span>
                        <strong>Featured:</strong> {announcement.featuredUser?.name || 'N/A'}
                      </span>
                      <span>
                        {new Date(announcement.dateAnnounced).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Announcement Details Modal */}
      {showModal && selectedAnnouncement && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>📢 Announcement Details</h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  margin: '0 0 1rem 0', 
                  color: 'var(--text-primary)',
                  fontSize: '1.5rem'
                }}>
                  {selectedAnnouncement.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={getTypeBadgeStyle(selectedAnnouncement.type)}>
                    {selectedAnnouncement.type.replace('-', ' ')}
                  </span>
                  <span style={getStatusBadgeStyle(selectedAnnouncement.visible)}>
                    {selectedAnnouncement.visible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>

              {selectedAnnouncement.description && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem'
                  }}>
                    Description
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                  }}>
                    {selectedAnnouncement.description}
                  </p>
                </div>
              )}

              <div style={{ 
                backgroundColor: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem'
                }}>
                  Featured User Details
                </h4>
                <div style={{ color: 'var(--text-secondary)' }}>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>Name:</strong> {selectedAnnouncement.featuredUser?.name || 'N/A'}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>Role:</strong> {selectedAnnouncement.featuredUser?.role || 'N/A'}
                  </p>
                  {selectedAnnouncement.featuredUser?.email && (
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong>Email:</strong> {selectedAnnouncement.featuredUser.email}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-light)',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem'
              }}>
                <span>
                  <strong>Created:</strong> {new Date(selectedAnnouncement.dateAnnounced).toLocaleString()}
                </span>
                <span>
                  <strong>ID:</strong> {selectedAnnouncement._id}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Announcements;