


// import React, { useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const AssignResult = () => {
//   const { user, token } = useContext(AuthContext);
//   const [subjects, setSubjects] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [results, setResults] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [marks, setMarks] = useState('');
//   const [comments, setComments] = useState('');
//   const [error, setError] = useState('');

//   // Fetch subjects when user and token ready
//   useEffect(() => {
//     if (!user || !token) return;
//     const fetchSubjects = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/subjects', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const filteredSubjects = res.data.filter(
//           (sub) => sub.teacher === user.id || (sub.teacher && sub.teacher._id === user.id)
//         );
//         setSubjects(filteredSubjects);
//       } catch {
//         setError('Failed to load subjects');
//       }
//     };
//     fetchSubjects();
//   }, [user, token]);

//   // Fetch students for selected subject
//   useEffect(() => {
//     if (!selectedSubject || !token) {
//       setStudents([]);
//       setSelectedStudent('');
//       return;
//     }
//     const fetchStudents = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/subjects/${selectedSubject}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStudents(res.data.students || []);
//         setSelectedStudent('');
//       } catch {
//         setError('Failed to load students');
//       }
//     };
//     fetchStudents();
//   }, [selectedSubject, token]);

//   // Fetch all results assigned by this teacher
//   const fetchResults = async () => {
//     if (!user || !token || !user.id) {
//       console.log('Missing user, token, or user.id - User:', user, 'Token exists:', !!token);
//       return;
//     }
    
//     try {
//       console.log('Fetching results for teacher ID:', user.id);
//       const res = await axios.get(`http://localhost:5000/api/results/teacher/${user.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Results fetched successfully:", res.data);
//       console.log("Number of results:", res.data.length);
//       setResults(res.data);
//       setError('');
//     } catch (err) {
//       console.error('Error fetching results:', err);
//       console.error('Error response:', err.response);
//       setError('Failed to load results: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   useEffect(() => {
//     console.log('useEffect triggered - User:', user, 'Token exists:', !!token);
//     if (token && user && user.id) {
//       fetchResults();
//     } else {
//       console.log('Conditions not met for fetching results');
//     }
//   }, [user, token]);

//   // Submit new or updated result
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedSubject || !selectedStudent) {
//       setError('Please select subject and student');
//       return;
//     }
//     try {
//       await axios.post(
//         'http://localhost:5000/api/results',
//         {
//           subjectId: selectedSubject,
//           studentId: selectedStudent,
//           marks,
//           comments,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMarks('');
//       setComments('');
//       setSelectedSubject('');
//       setSelectedStudent('');
//       fetchResults(); // Refresh the results table
//     } catch {
//       setError('Failed to save result');
//     }
//   };

//   return (
//     <div>
//       <h2>Teacher Dashboard</h2>
//       <h3>Assign Result</h3>
      
//       {/* Debug info */}
//       <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '14px' }}>
//         <strong>Debug Info:</strong> User ID: {user?.id || 'No user'}, Results: {results.length}
//       </div>

//       <form onSubmit={handleSubmit}>
//         <label>
//           Subject:
//           <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
//             <option value="">Select Subject</option>
//             {subjects.map((sub) => (
//               <option key={sub._id} value={sub._id}>{sub.name}</option>
//             ))}
//           </select>
//         </label>
//         <br />
//         <label>
//           Student:
//           <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} disabled={!students.length}>
//             <option value="">Select Student</option>
//             {students.map((s) => (
//               <option key={s._id} value={s._id}>{s.name}</option>
//             ))}
//           </select>
//         </label>
//         <br />
//         <label>
//           Marks:
//           <input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} />
//         </label>
//         <br />
//         <label>
//           Comments:
//           <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
//         </label>
//         <br />
//         <button type="submit" disabled={!selectedSubject || !selectedStudent}>Assign Result</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <h3>Given Results</h3>
//       {results.length === 0 ? (
//         <p>No results assigned yet.</p>
//       ) : (
//         <table border="1" cellPadding="6" cellSpacing="0" style={{ marginTop: '10px', width: '100%' }}>
//           <thead>
//             <tr>
//               <th>Student</th>
//               <th>Subject</th>
//               <th>Marks</th>
//               <th>Comments</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {results.map((r) => (
//               <tr key={r._id}>
//                 <td>{r.student?.name || 'N/A'}</td>
//                 <td>{r.subject?.name || 'N/A'}</td>
//                 <td>{r.marks}</td>
//                 <td>{r.comments}</td>
//                 <td>{new Date(r.createdAt).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default AssignResult;
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api.js';

const AssignResult = () => {
  const { user, token } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marks, setMarks] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterSubject, setFilterSubject] = useState('all');

  // Fetch subjects when user and token ready
  useEffect(() => {
    if (!user || !token) return;
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredSubjects = res.data.filter(
          (sub) => sub.teacher === user.id || (sub.teacher && sub.teacher._id === user.id)
        );
        setSubjects(filteredSubjects);
        setError('');
      } catch {
        setError('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [user, token]);

  // Fetch students for selected subject
  useEffect(() => {
    if (!selectedSubject || !token) {
      setStudents([]);
      setSelectedStudent('');
      return;
    }
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/subjects/${selectedSubject}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data.students || []);
        setSelectedStudent('');
        setError('');
      } catch {
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedSubject, token]);

  // Fetch all results assigned by this teacher
  const fetchResults = async () => {
    if (!user || !token || !user.id) return;
    
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/results/teacher/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load results: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user && user.id) {
      fetchResults();
    }
  }, [user, token]);

  // Submit new or updated result
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject || !selectedStudent) {
      setError('Please select subject and student');
      return;
    }
    if (!marks || marks < 0 || marks > 100) {
      setError('Please enter valid marks (0-100)');
      return;
    }
    
    try {
      setSubmitting(true);
      await axios.post(
        `${API_BASE_URL}/results`,
        {
          subjectId: selectedSubject,
          studentId: selectedStudent,
          marks: parseInt(marks),
          comments,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMarks('');
      setComments('');
      setSelectedSubject('');
      setSelectedStudent('');
      setSuccess('Result assigned successfully!');
      setError('');
      fetchResults(); // Refresh the results table
    } catch (err) {
      setError('Failed to save result: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    } finally {
      setSubmitting(false);
    }
  };

  const getGrade = (marks) => {
    if (marks >= 90) return { grade: 'A+', color: 'var(--success)' };
    if (marks >= 80) return { grade: 'A', color: 'var(--success)' };
    if (marks >= 70) return { grade: 'B', color: 'var(--info)' };
    if (marks >= 60) return { grade: 'C', color: 'var(--warning)' };
    if (marks >= 33) return { grade: 'D', color: 'var(--warning)' };
    return { grade: 'F', color: 'var(--error)' };
  };

  const getGradeBadgeStyle = (marks) => {
    const { grade, color } = getGrade(marks);
    return {
      backgroundColor: color,
      color: 'white',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: '600'
    };
  };

  const refreshData = async () => {
    await fetchResults();
    setSuccess('Data refreshed successfully!');
  };

  // Filter results based on selected subject filter
  const filteredResults = results.filter(result => 
    filterSubject === 'all' || result.subject?._id === filterSubject
  );

  // Calculate statistics
  const totalResults = results.length;
  const averageMarks = results.length > 0 
    ? (results.reduce((sum, result) => sum + result.marks, 0) / results.length).toFixed(1)
    : 0;
  const passedStudents = results.filter(result => result.marks >= 33).length;

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
    <div className="container mt-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div 
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}
              >
                <span style={{ color: 'white', fontSize: '1.5rem' }}>📝</span>
              </div>
              <div>
                <h1 className="h2 mb-1" style={{ color: 'var(--text-primary)' }}>
                  Teacher Dashboard
                </h1>
                <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                  Assign and manage student results
                </p>
              </div>
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className="btn d-flex align-items-center"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Loading...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '0.5rem' }}>🔄</span>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>📊</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{totalResults}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Results Assigned</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--info)' }}>📈</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{averageMarks}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Average Marks</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--success)' }}>✅</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{passedStudents}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Passed Students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Assign Result Form */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <h5 className="card-title mb-0">
                <span style={{ marginRight: '0.5rem' }}>🎯</span>
                Assign New Result
              </h5>
            </div>
            <div className="card-body">
              {/* Alerts */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <span style={{ marginRight: '0.5rem' }}>⚠️</span>
                  <div>{error}</div>
                </div>
              )}
              {success && (
                <div className="alert alert-success d-flex align-items-center" role="alert">
                  <span style={{ marginRight: '0.5rem' }}>✅</span>
                  <div>{success}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    Subject
                  </label>
                  <select 
                    className="form-select"
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    style={{
                      border: '1px solid var(--border-light)',
                      borderRadius: '0.5rem'
                    }}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    Student
                  </label>
                  <select 
                    className="form-select"
                    value={selectedStudent} 
                    onChange={(e) => setSelectedStudent(e.target.value)} 
                    disabled={!students.length}
                    style={{
                      border: '1px solid var(--border-light)',
                      borderRadius: '0.5rem'
                    }}
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                  {!students.length && selectedSubject && (
                    <div className="form-text" style={{ color: 'var(--text-secondary)' }}>
                      No students enrolled in this subject
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    Marks (0-100)
                  </label>
                  <input 
                    type="number" 
                    className="form-control"
                    min="0"
                    max="100"
                    value={marks} 
                    onChange={(e) => setMarks(e.target.value)}
                    placeholder="Enter marks out of 100"
                    style={{
                      border: '1px solid var(--border-light)',
                      borderRadius: '0.5rem'
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    Comments
                  </label>
                  <textarea 
                    className="form-control"
                    rows="3"
                    value={comments} 
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Optional comments about student performance"
                    style={{
                      border: '1px solid var(--border-light)',
                      borderRadius: '0.5rem'
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={!selectedSubject || !selectedStudent || !marks || submitting}
                  className="btn w-100 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: 'var(--success)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem'
                  }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Assigning...
                    </>
                  ) : (
                    <>
                      <span style={{ marginRight: '0.5rem' }}>📨</span>
                      Assign Result
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <h5 className="card-title mb-0">
                <span style={{ marginRight: '0.5rem' }}>📋</span>
                Assigned Results ({filteredResults.length})
              </h5>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>{subject.name}</option>
                ))}
              </select>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>📭</div>
                  <h6 style={{ color: 'var(--text-secondary)' }}>No Results Found</h6>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {filterSubject === 'all' 
                      ? "You haven't assigned any results yet" 
                      : `No results found for selected subject`
                    }
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <tr>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Student</th>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Subject</th>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Marks</th>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Grade</th>
                        <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((r) => (
                        <tr key={r._id} style={{ borderColor: 'var(--border-light)' }}>
                          <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                            <strong>{r.student?.name || 'N/A'}</strong>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                            {r.subject?.name || 'N/A'}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div className="d-flex align-items-center gap-2">
                              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                {r.marks}
                              </span>
                              <span style={getGradeBadgeStyle(r.marks)}>
                                {getGrade(r.marks).grade}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span 
                              className={`badge ${r.marks >= 33 ? 'bg-success' : 'bg-danger'}`}
                              style={{ fontSize: '0.8rem' }}
                            >
                              {r.marks >= 33 ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                            {new Date(r.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignResult;