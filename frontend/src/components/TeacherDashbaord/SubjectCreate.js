

// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// const timeSlots = [
//   "08:00 AM - 09:00 AM",
//   "09:00 AM - 10:00 AM",
//   "10:00 AM - 11:00 AM",
//   "11:00 AM - 12:00 PM",
//   "12:00 PM - 01:00 PM",
//   "01:00 PM - 02:00 PM",
//   "02:00 PM - 03:00 PM",
//   "03:00 PM - 04:00 PM",
//   "04:00 PM - 05:00 PM",
// ];

// const SubjectCreate = () => {
//   const { token } = useContext(AuthContext);

//   const [form, setForm] = useState({
//     name: '',
//     description: '',
//     classTimings: [], // Array of objects {day, startTime, endTime}
//     courseContent: '',
//   });

//   const [day, setDay] = useState('');
//   const [timeSlot, setTimeSlot] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleTimingAdd = () => {
//     if (!day || !timeSlot) {
//       setError("Please select both day and time slot");
//       return;
//     }
//     const [startTime, endTime] = timeSlot.split(' - ');
//     // Add to classTimings array if not duplicate
//     const exists = form.classTimings.some(
//       (t) => t.day === day && t.startTime === startTime && t.endTime === endTime
//     );
//     if (exists) {
//       setError("This timing is already added");
//       return;
//     }
//     const newTimings = [...form.classTimings, { day, startTime, endTime }];
//     setForm({ ...form, classTimings: newTimings });
//     setDay('');
//     setTimeSlot('');
//     setError('');
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name.trim()) {
//       setError("Subject name is required");
//       return;
//     }
//     if (form.classTimings.length === 0) {
//       setError("Please add at least one class timing");
//       return;
//     }
//     try {
//       const res = await axios.post(`${API_BASE_URL}/subjects', form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuccess(`Subject "${res.data.name}" created successfully!`);
//       setForm({ name: '', description: '', classTimings: [], courseContent: '' });
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create subject');
//     }
//   };

//   return (
//     <div>
//       <h2>Create New Subject</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Name:<br />
//           <input type="text" name="name" value={form.name} onChange={handleChange} required />
//         </label>

//         <br />

//         <label>
//           Description:<br />
//           <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
//         </label>

//         <br />

//         <label>
//           Add Class Timing:<br />
//           <select value={day} onChange={(e) => setDay(e.target.value)}>
//             <option value="">Select Day</option>
//             {daysOptions.map((d) => (
//               <option key={d} value={d}>{d}</option>
//             ))}
//           </select>

//           <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
//             <option value="">Select Time Slot</option>
//             {timeSlots.map((t) => (
//               <option key={t} value={t}>{t}</option>
//             ))}
//           </select>

//           <button type="button" onClick={handleTimingAdd}>Add Timing</button>
//         </label>

//         <br />

//         <div>
//           <strong>Current Timings:</strong>
//           <ul>
//             {form.classTimings.map(({ day, startTime, endTime }, idx) => (
//               <li key={idx}>{day} {startTime} - {endTime}</li>
//             ))}
//           </ul>
//         </div>

//         <br />

//         <label>
//           Course Content:<br />
//           <textarea name="courseContent" value={form.courseContent} onChange={handleChange} rows="4" />
//         </label>

//         <br />

//         <button type="submit">Create Subject</button>
//       </form>
//     </div>
//   );
// };

// export default SubjectCreate;

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api.js';

const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeSlots = [
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

const SubjectCreate = () => {
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: '',
    description: '',
    classTimings: [],
    courseContent: '',
  });

  const [day, setDay] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTimingAdd = () => {
    if (!day || !timeSlot) {
      setError("Please select both day and time slot");
      return;
    }
    const [startTime, endTime] = timeSlot.split(' - ');
    const exists = form.classTimings.some(
      (t) => t.day === day && t.startTime === startTime && t.endTime === endTime
    );
    if (exists) {
      setError("This timing is already added");
      return;
    }
    const newTimings = [...form.classTimings, { day, startTime, endTime }];
    setForm({ ...form, classTimings: newTimings });
    setDay('');
    setTimeSlot('');
    setError('');
  };

  const handleRemoveTiming = (index) => {
    const newTimings = form.classTimings.filter((_, i) => i !== index);
    setForm({ ...form, classTimings: newTimings });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Subject name is required");
      return;
    }
    if (form.classTimings.length === 0) {
      setError("Please add at least one class timing");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/subjects', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Subject "${res.data.name}" created successfully!`);
      setForm({ name: '', description: '', classTimings: [], courseContent: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm({ name: '', description: '', classTimings: [], courseContent: '' });
    setError('');
    setSuccess('');
  };

  // Inline CSS Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2rem',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
      borderRadius: '12px',
      color: 'white'
    },
    headerIcon: {
      width: '60px',
      height: '60px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem',
      fontSize: '1.5rem'
    },
    headerContent: {
      flex: 1
    },
    headerTitle: {
      margin: '0 0 0.5rem 0',
      fontSize: '1.8rem',
      fontWeight: '600'
    },
    headerSubtitle: {
      margin: '0',
      opacity: '0.9',
      fontSize: '1rem'
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '1fr 350px',
      gap: '2rem',
      alignItems: 'start'
    },
    formSection: {
      flex: 1
    },
    formCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    cardHeader: {
      backgroundColor: 'var(--primary)',
      color: 'white',
      padding: '1.5rem',
      margin: 0
    },
    cardHeaderTitle: {
      margin: 0,
      fontSize: '1.3rem',
      fontWeight: '600'
    },
    form: {
      padding: '2rem'
    },
    alert: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      fontSize: '0.9rem'
    },
    errorAlert: {
      backgroundColor: 'var(--error)',
      color: 'white'
    },
    successAlert: {
      backgroundColor: 'var(--success)',
      color: 'white'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    formLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      color: 'var(--text-primary)',
      fontWeight: '600',
      fontSize: '0.95rem'
    },
    formInput: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    formInputFocus: {
      outline: 'none',
      borderColor: 'var(--primary)',
      boxShadow: '0 0 0 3px rgba(29, 17, 69, 0.1)'
    },
    formTextarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '80px',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    timingSelectors: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr auto',
      gap: '0.75rem',
      alignItems: 'end'
    },
    formSelect: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'border-color 0.3s ease'
    },
    addTimingBtn: {
      padding: '0.75rem 1rem',
      backgroundColor: 'var(--success)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.3s ease',
      whiteSpace: 'nowrap'
    },
    currentTimings: {
      marginTop: '1rem',
      padding: '1.5rem',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '8px',
      border: '1px solid var(--border-light)'
    },
    currentTimingsTitle: {
      margin: '0 0 1rem 0',
      color: 'var(--text-primary)',
      fontSize: '1.1rem'
    },
    timingsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    timingItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      backgroundColor: 'white',
      border: '1px solid var(--border-light)',
      borderRadius: '6px',
      transition: 'border-color 0.3s ease'
    },
    timingText: {
      color: 'var(--text-primary)',
      fontWeight: '500'
    },
    removeTimingBtn: {
      padding: '0.25rem 0.5rem',
      backgroundColor: 'var(--error)',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease'
    },
    formActions: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem'
    },
    submitBtn: {
      flex: 1,
      padding: '1rem 1.5rem',
      backgroundColor: 'var(--primary)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.3s ease'
    },
    clearBtn: {
      padding: '1rem 1.5rem',
      backgroundColor: 'var(--secondary)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    infoSection: {
      position: 'sticky',
      top: '2rem'
    },
    infoCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    infoHeader: {
      backgroundColor: 'var(--info)',
      color: 'white',
      padding: '1.5rem',
      margin: 0
    },
    infoHeaderTitle: {
      margin: 0,
      fontSize: '1.2rem',
      fontWeight: '600'
    },
    infoContent: {
      padding: '1.5rem'
    },
    infoGroup: {
      marginBottom: '1.5rem'
    },
    infoGroupTitle: {
      margin: '0 0 0.75rem 0',
      color: 'var(--text-primary)',
      fontSize: '1rem',
      fontWeight: '600'
    },
    infoList: {
      margin: 0,
      paddingLeft: '1.25rem',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem',
      lineHeight: '1.5'
    },
    summaryBox: {
      padding: '1rem',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '6px',
      fontSize: '0.9rem',
      color: 'var(--text-secondary)',
      marginTop: '1rem'
    },
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  // Add hover effects
  const hoverStyles = {
    formInput: { ...styles.formInput, ':hover': { borderColor: 'var(--primary)' } },
    formSelect: { ...styles.formSelect, ':hover': { borderColor: 'var(--primary)' } },
    formTextarea: { ...styles.formTextarea, ':hover': { borderColor: 'var(--primary)' } },
    addTimingBtn: { ...styles.addTimingBtn, ':hover': { backgroundColor: 'var(--success-hover)' } },
    removeTimingBtn: { ...styles.removeTimingBtn, ':hover': { backgroundColor: 'var(--error-hover)' } },
    submitBtn: { ...styles.submitBtn, ':hover': { backgroundColor: 'var(--primary-hover)' } },
    clearBtn: { ...styles.clearBtn, ':hover': { backgroundColor: 'var(--secondary-hover)' } },
    timingItem: { ...styles.timingItem, ':hover': { borderColor: 'var(--primary)' } }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <span>📚</span>
        </div>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Create New Subject</h1>
          <p style={styles.headerSubtitle}>Set up a new course with class timings and details</p>
        </div>
      </div>

      <div style={styles.content}>
        {/* Form Section */}
        <div style={styles.formSection}>
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardHeaderTitle}>➕ Subject Details</h2>
            </div>
            
            {/* Alerts */}
            {error && (
              <div style={{...styles.alert, ...styles.errorAlert}}>
                <span style={{marginRight: '0.5rem'}}>⚠️</span>
                <div>{error}</div>
              </div>
            )}
            
            {success && (
              <div style={{...styles.alert, ...styles.successAlert}}>
                <span style={{marginRight: '0.5rem'}}>✅</span>
                <div>{success}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Subject Name */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Subject Name *
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  placeholder="Enter subject name"
                  required
                  style={styles.formInput}
                  onFocus={(e) => e.target.style = {...styles.formInput, ...styles.formInputFocus}}
                  onBlur={(e) => e.target.style = styles.formInput}
                />
              </div>

              {/* Description */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Description
                </label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange}
                  rows="3"
                  placeholder="Brief description of the subject..."
                  style={styles.formTextarea}
                  onFocus={(e) => e.target.style = {...styles.formTextarea, ...styles.formInputFocus}}
                  onBlur={(e) => e.target.style = styles.formTextarea}
                />
              </div>

              {/* Class Timings */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Add Class Timing *
                </label>
                <div style={styles.timingSelectors}>
                  <select 
                    value={day} 
                    onChange={(e) => setDay(e.target.value)}
                    style={styles.formSelect}
                  >
                    <option value="">Select Day</option>
                    {daysOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <select 
                    value={timeSlot} 
                    onChange={(e) => setTimeSlot(e.target.value)}
                    style={styles.formSelect}
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  <button 
                    type="button" 
                    onClick={handleTimingAdd}
                    style={styles.addTimingBtn}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--success-hover)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--success)'}
                  >
                    <span>➕</span>
                    Add Timing
                  </button>
                </div>
              </div>

              {/* Current Timings */}
              {form.classTimings.length > 0 && (
                <div style={styles.currentTimings}>
                  <h4 style={styles.currentTimingsTitle}>
                    Current Timings ({form.classTimings.length})
                  </h4>
                  <div style={styles.timingsList}>
                    {form.classTimings.map(({ day, startTime, endTime }, idx) => (
                      <div 
                        key={idx} 
                        style={styles.timingItem}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
                      >
                        <span style={styles.timingText}>
                          {day} {startTime} - {endTime}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTiming(idx)}
                          style={styles.removeTimingBtn}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--error-hover)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--error)'}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Content */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Course Content
                </label>
                <textarea 
                  name="courseContent" 
                  value={form.courseContent} 
                  onChange={handleChange}
                  rows="4"
                  placeholder="Detailed course content, topics covered, learning objectives..."
                  style={styles.formTextarea}
                  onFocus={(e) => e.target.style = {...styles.formTextarea, ...styles.formInputFocus}}
                  onBlur={(e) => e.target.style = styles.formTextarea}
                />
              </div>

              {/* Action Buttons */}
              <div style={styles.formActions}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={styles.submitBtn}
                  onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary-hover)')}
                  onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary)')}
                >
                  {loading ? (
                    <>
                      <div style={styles.spinner}></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <span>📚</span>
                      Create Subject
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  onClick={clearForm}
                  style={styles.clearBtn}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--secondary-hover)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--secondary)'}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div style={styles.infoSection}>
          <div style={styles.infoCard}>
            <div style={styles.infoHeader}>
              <h3 style={styles.infoHeaderTitle}>💡 Creating a New Subject</h3>
            </div>
            <div style={styles.infoContent}>
              <div style={styles.infoGroup}>
                <h4 style={styles.infoGroupTitle}>Required Fields</h4>
                <ul style={styles.infoList}>
                  <li>Subject Name</li>
                  <li>At least one class timing</li>
                </ul>
              </div>

              <div style={styles.infoGroup}>
                <h4 style={styles.infoGroupTitle}>Best Practices</h4>
                <ul style={styles.infoList}>
                  <li>Use descriptive subject names</li>
                  <li>Add multiple timings for flexibility</li>
                  <li>Provide clear course content</li>
                  <li>Consider student availability</li>
                </ul>
              </div>

              {form.classTimings.length > 0 && (
                <div style={styles.summaryBox}>
                  <strong>Summary:</strong> {form.classTimings.length} timing(s) added for {form.name || 'new subject'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

export default SubjectCreate;