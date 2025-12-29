// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const PublicInfoAdmin = () => {
//   const { token } = useContext(AuthContext);
//   const [publicInfos, setPublicInfos] = useState([]);
//   const [form, setForm] = useState({ title: '', description: '', visible: true });
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchPublicInfo = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/public-info', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPublicInfos(res.data);
//       } catch (err) {
//         setError('Failed to load public info');
//       }
//     };
//     if (token) fetchPublicInfo();
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
//       await axios.post('http://localhost:5000/api/public-info', form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setForm({ title: '', description: '', visible: true });
//       // Refresh list
//       const res = await axios.get('http://localhost:5000/api/public-info', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPublicInfos(res.data);
//     } catch (err) {
//       setError('Failed to add public info');
//     }
//   };

//   const toggleVisibility = async (id, currentVisibility) => {
//     try {
//       await axios.put(
//         `http://localhost:5000/api/public-info/${id}`,
//         { visible: !currentVisibility },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPublicInfos((prev) =>
//         prev.map((info) =>
//           info._id === id ? { ...info, visible: !currentVisibility } : info
//         )
//       );
//     } catch (err) {
//       setError('Failed to update visibility');
//     }
//   };

//   return (
//     <div>
//       <h2>Public Information Management (Admin)</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           name="title"
//           placeholder="Title"
//           value={form.title}
//           onChange={handleChange}
//           required
//         />
//         <br />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           required
//         />
//         <br />
//         <label>
//           Visible:
//           <input type="checkbox" name="visible" checked={form.visible} onChange={handleChange} />
//         </label>
//         <br />
//         <button type="submit">Add Public Info</button>
//       </form>
//       <hr />
//       <h3>Existing Public Info</h3>
//       <ul>
//         {publicInfos.map((info) => (
//           <li key={info._id}>
//             <strong>{info.title}</strong>: {info.description} -{' '}
//             <button onClick={() => toggleVisibility(info._id, info.visible)}>
//               {info.visible ? 'Hide' : 'Show'}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default PublicInfoAdmin;



import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const PublicInfoAdmin = () => {
  const { token, user } = useContext(AuthContext);
  const [publicInfos, setPublicInfos] = useState([]);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    category: 'general',
    priority: 'medium',
    visible: true 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'general', label: '📢 General', color: 'var(--primary)' },
    { value: 'important', label: '⚠️ Important', color: 'var(--warning)' },
    { value: 'urgent', label: '🚨 Urgent', color: 'var(--error)' },
    { value: 'update', label: '🔄 Update', color: 'var(--info)' },
    { value: 'event', label: '🎉 Event', color: 'var(--success)' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'var(--success)' },
    { value: 'medium', label: 'Medium', color: 'var(--warning)' },
    { value: 'high', label: 'High', color: 'var(--error)' }
  ];

  useEffect(() => {
    const fetchPublicInfo = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/public-info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ensure all info objects have required fields
        const processedData = Array.isArray(res.data) ? res.data.map(info => ({
          ...info,
          title: info.title || 'Untitled',
          description: info.description || '',
          category: info.category || 'general',
          priority: info.priority || 'medium',
          visible: info.visible !== undefined ? info.visible : true,
          createdAt: info.createdAt || new Date().toISOString(),
          updatedAt: info.updatedAt || new Date().toISOString()
        })) : [];
        setPublicInfos(processedData);
        setError('');
      } catch (err) {
        setError('Failed to load public information');
        setPublicInfos([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchPublicInfo();
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
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/public-info', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ 
        title: '', 
        description: '', 
        category: 'general',
        priority: 'medium',
        visible: true 
      });
      setSuccess('Public information added successfully!');
      setError('');
      
      // Refresh list
      const res = await axios.get('http://localhost:5000/api/public-info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const processedData = Array.isArray(res.data) ? res.data.map(info => ({
        ...info,
        title: info.title || 'Untitled',
        description: info.description || '',
        category: info.category || 'general',
        priority: info.priority || 'medium',
        visible: info.visible !== undefined ? info.visible : true,
        createdAt: info.createdAt || new Date().toISOString(),
        updatedAt: info.updatedAt || new Date().toISOString()
      })) : [];
      setPublicInfos(processedData);
    } catch (err) {
      setError('Failed to add public information: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id, currentVisibility, title) => {
    try {
      setActionLoading(id);
      await axios.put(
        `http://localhost:5000/api/public-info/${id}`,
        { visible: !currentVisibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPublicInfos((prev) =>
        prev.map((info) =>
          info._id === id ? { ...info, visible: !currentVisibility } : info
        )
      );
      setSuccess(`"${title}" ${!currentVisibility ? 'published' : 'hidden'} successfully!`);
      setError('');
    } catch (err) {
      setError('Failed to update visibility: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(id);
      await axios.delete(`http://localhost:5000/api/public-info/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPublicInfos((prev) => prev.filter((info) => info._id !== id));
      setSuccess(`"${title}" deleted successfully!`);
      setError('');
    } catch (err) {
      setError('Failed to delete information: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (info) => {
    setSelectedInfo(info);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInfo(null);
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/public-info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const processedData = Array.isArray(res.data) ? res.data.map(info => ({
        ...info,
        title: info.title || 'Untitled',
        description: info.description || '',
        category: info.category || 'general',
        priority: info.priority || 'medium',
        visible: info.visible !== undefined ? info.visible : true,
        createdAt: info.createdAt || new Date().toISOString(),
        updatedAt: info.updatedAt || new Date().toISOString()
      })) : [];
      setPublicInfos(processedData);
      setSuccess('Public information refreshed successfully!');
      setError('');
    } catch (err) {
      setError('Failed to refresh public information');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm({ 
      title: '', 
      description: '', 
      category: 'general',
      priority: 'medium',
      visible: true 
    });
    setError('');
  };

  const getCategoryBadgeStyle = (category) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return {
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.375rem 0.75rem',
      borderRadius: '1.5rem',
      backgroundColor: categoryObj?.color || 'var(--secondary)',
      color: 'white'
    };
  };

  const getPriorityBadgeStyle = (priority) => {
    const priorityObj = priorities.find(pri => pri.value === priority);
    return {
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.375rem 0.75rem',
      borderRadius: '1.5rem',
      backgroundColor: priorityObj?.color || 'var(--secondary)',
      color: 'white'
    };
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

  // Safe description getter with fallback
  const getDescriptionPreview = (description) => {
    const desc = description || '';
    return desc.length > 120 ? `${desc.substring(0, 120)}...` : desc;
  };

  // Filter and search public info
  const filteredInfos = publicInfos.filter(info => {
    if (!info) return false;
    
    // Filter by visibility
    if (filter === 'visible' && !info.visible) return false;
    if (filter === 'hidden' && info.visible) return false;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const title = info.title || '';
      const description = info.description || '';
      const category = info.category || '';
      
      return (
        title.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower) ||
        category.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Calculate statistics
  const totalInfos = publicInfos.length;
  const visibleInfos = publicInfos.filter(info => info?.visible).length;
  const hiddenInfos = totalInfos - visibleInfos;

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
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
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
              Public Information Management
            </h1>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)',
              fontSize: '1rem'
            }}>
              Create and manage public announcements and information
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

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>📋</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{totalInfos}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Items</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }}>👁️</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{visibleInfos}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Visible</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--error)', marginBottom: '0.5rem' }}>👻</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{hiddenInfos}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Hidden</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Create Form */}
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
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>➕ Create New Information</h2>
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
                  Title *
                </label>
                <input
                  name="title"
                  placeholder="Enter information title"
                  value={form.title}
                  onChange={handleChange}
                  required
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
                  Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Enter detailed information"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="4"
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

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    fontWeight: '600'
                  }}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
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
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    fontWeight: '600'
                  }}>
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={form.priority}
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
                    {priorities.map(pri => (
                      <option key={pri.value} value={pri.value}>
                        {pri.label}
                      </option>
                    ))}
                  </select>
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
                  Make this information visible to users
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    backgroundColor: loading ? 'var(--secondary)' : 'var(--success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <span>📢</span>
                      Create Information
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

        {/* Existing Information */}
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
              📋 Existing Information ({filteredInfos.length})
            </h2>
          </div>

          {/* Filters */}
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr auto',
              gap: '1rem',
              alignItems: 'end'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Filter
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="all">All Items</option>
                  <option value="visible">Visible Only</option>
                  <option value="hidden">Hidden Only</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--secondary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Clear
              </button>
            </div>
          </div>
          
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
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
            ) : filteredInfos.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>No Information Found</h4>
                <p style={{ margin: 0 }}>
                  {searchTerm || filter !== 'all' 
                    ? 'No items match your current filters.' 
                    : 'No public information available. Create your first item!'
                  }
                </p>
              </div>
            ) : (
              filteredInfos.map((info) => (
                info && (
                  <div 
                    key={info._id}
                    style={{
                      padding: '1.5rem',
                      borderBottom: '1px solid var(--border-light)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={() => handleViewDetails(info)}
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
                        {info.title || 'Untitled'}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <span style={getCategoryBadgeStyle(info.category)}>
                          {categories.find(cat => cat.value === info.category)?.label.split(' ')[1] || 'General'}
                        </span>
                        <span style={getStatusBadgeStyle(info.visible)}>
                          {info.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                    
                    <p style={{ 
                      margin: '0 0 0.75rem 0', 
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      lineHeight: '1.4'
                    }}>
                      {getDescriptionPreview(info.description)}
                    </p>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <span style={getPriorityBadgeStyle(info.priority)}>
                          {info.priority} priority
                        </span>
                        <span>
                          Created: {info.createdAt ? new Date(info.createdAt).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVisibility(info._id, info.visible, info.title);
                          }}
                          disabled={actionLoading === info._id}
                          style={{
                            padding: '0.375rem 0.75rem',
                            backgroundColor: actionLoading === info._id ? 'var(--secondary)' : (info.visible ? 'var(--warning)' : 'var(--success)'),
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: actionLoading === info._id ? 'not-allowed' : 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            opacity: actionLoading === info._id ? 0.7 : 1
                          }}
                        >
                          {actionLoading === info._id ? '...' : (info.visible ? 'Hide' : 'Show')}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(info._id, info.title);
                          }}
                          disabled={actionLoading === info._id}
                          style={{
                            padding: '0.375rem 0.75rem',
                            backgroundColor: actionLoading === info._id ? 'var(--secondary)' : 'var(--error)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: actionLoading === info._id ? 'not-allowed' : 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            opacity: actionLoading === info._id ? 0.7 : 1
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))
            )}
          </div>
        </div>
      </div>

      {/* Information Details Modal */}
      {showModal && selectedInfo && (
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
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>📢 Information Details</h2>
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
                  {selectedInfo.title || 'Untitled'}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={getCategoryBadgeStyle(selectedInfo.category)}>
                    {categories.find(cat => cat.value === selectedInfo.category)?.label || '📢 General'}
                  </span>
                  <span style={getPriorityBadgeStyle(selectedInfo.priority)}>
                    {selectedInfo.priority} priority
                  </span>
                  <span style={getStatusBadgeStyle(selectedInfo.visible)}>
                    {selectedInfo.visible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>

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
                  {selectedInfo.description || 'No description provided.'}
                </p>
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
                  <strong>Created:</strong> {selectedInfo.createdAt ? new Date(selectedInfo.createdAt).toLocaleString() : 'Unknown'}
                </span>
                <span>
                  <strong>Updated:</strong> {selectedInfo.updatedAt ? new Date(selectedInfo.updatedAt).toLocaleString() : 'Unknown'}
                </span>
              </div>

              <div style={{ 
                display: 'flex',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                <button
                  onClick={() => toggleVisibility(selectedInfo._id, selectedInfo.visible, selectedInfo.title)}
                  disabled={actionLoading === selectedInfo._id}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    backgroundColor: actionLoading === selectedInfo._id ? 'var(--secondary)' : (selectedInfo.visible ? 'var(--warning)' : 'var(--success)'),
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: actionLoading === selectedInfo._id ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: actionLoading === selectedInfo._id ? 0.7 : 1
                  }}
                >
                  {actionLoading === selectedInfo._id ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  ) : (
                    selectedInfo.visible ? '👁️' : '👁️'
                  )}
                  {selectedInfo.visible ? 'Hide Information' : 'Publish Information'}
                </button>
                <button
                  onClick={() => handleDelete(selectedInfo._id, selectedInfo.title)}
                  disabled={actionLoading === selectedInfo._id}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    backgroundColor: actionLoading === selectedInfo._id ? 'var(--secondary)' : 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: actionLoading === selectedInfo._id ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: actionLoading === selectedInfo._id ? 0.7 : 1
                  }}
                >
                  {actionLoading === selectedInfo._id ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  ) : (
                    '🗑️'
                  )}
                  Delete
                </button>
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

export default PublicInfoAdmin;