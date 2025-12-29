

// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const Results = () => {
//   const { token, user } = useContext(AuthContext);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState('');

//   // Fetch subjects owned by this teacher/admin
//   useEffect(() => {
//     if (!token || !user) return;
//     const fetchSubjects = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/subjects', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         // Filter subjects to only those owned by current user if teacher
//         const filteredSubjects = res.data.filter(
//           (sub) => sub.teacher === user._id || (sub.teacher && sub.teacher._id === user._id)
//         );
//         setSubjects(filteredSubjects);
//       } catch {
//         setError('Failed to load subjects');
//       }
//     };
//     fetchSubjects();
//   }, [token, user]);

//   // Fetch students for selected subject
//   useEffect(() => {
//     if (!token || !selectedSubject) {
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
//         setError('Failed to load students for selected subject');
//       }
//     };
//     fetchStudents();
//   }, [selectedSubject, token]);

//   // Fetch results for selected student and subject
//   useEffect(() => {
//     if (!token || !selectedStudent || !selectedSubject) {
//       setResults([]);
//       return;
//     }
//     const fetchResults = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/results/${selectedStudent}?subjectId=${selectedSubject}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setResults(res.data);
//       } catch {
//         setError('Failed to load results data');
//       }
//     };
//     fetchResults();
//   }, [selectedStudent, selectedSubject, token]);

//   return (
//     <div>
//       <h2>Results</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <label>
//         Select Subject:
//         <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
//           <option value="">-- Select Subject --</option>
//           {subjects.map((sub) => (
//             <option key={sub._id} value={sub._id}>
//               {sub.name}
//             </option>
//           ))}
//         </select>
//       </label>

//       <br />

//       <label>
//         Select Student:
//         <select
//           disabled={!students.length}
//           value={selectedStudent}
//           onChange={(e) => setSelectedStudent(e.target.value)}
//         >
//           <option value="">-- Select Student --</option>
//           {students.map((student) => (
//             <option key={student._id} value={student._id}>
//               {student.name}
//             </option>
//           ))}
//         </select>
//       </label>

//       <br />

//       {selectedStudent === '' ? (
//         <p>Please select a student.</p>
//       ) : results.length === 0 ? (
//         <p>No results found for this student in this subject.</p>
//       ) : (
//         <table border="1" cellPadding="6" cellSpacing="0" style={{ marginTop: '10px' }}>
//           <thead>
//             <tr>
//               <th>Subject</th>
//               <th>Marks</th>
//               <th>Comments</th>
//               <th>Teacher</th>
//             </tr>
//           </thead>
//           <tbody>
//             {results.map((result) => (
//               <tr key={result._id}>
//                 <td>{result.subject?.name || 'N/A'}</td>
//                 <td>{result.marks}</td>
//                 <td>{result.comments}</td>
//                 <td>{result.teacher?.name || 'N/A'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Results;



import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const Results = () => {
  const { token, user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);

  // Fetch subjects owned by this teacher/admin
  useEffect(() => {
    if (!token || !user) return;
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter subjects to only those owned by current user if teacher
        const filteredSubjects = res.data.filter(
          (sub) => sub.teacher === user._id || (sub.teacher && sub.teacher._id === user._id)
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
  }, [token, user]);

  // Fetch students for selected subject
  useEffect(() => {
    if (!token || !selectedSubject) {
      setStudents([]);
      setSelectedStudent('');
      setStudentDetails(null);
      return;
    }
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/subjects/${selectedSubject}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data.students || []);
        setSelectedStudent('');
        setStudentDetails(null);
        setResults([]);
        setError('');
      } catch {
        setError('Failed to load students for selected subject');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedSubject, token]);

  // Fetch student details when selected
  useEffect(() => {
    if (!token || !selectedStudent) {
      setStudentDetails(null);
      return;
    }
    const fetchStudentDetails = async () => {
      try {
        const student = students.find(s => s._id === selectedStudent);
        if (student) {
          setStudentDetails(student);
        }
      } catch {
        console.error('Failed to load student details');
      }
    };
    fetchStudentDetails();
  }, [selectedStudent, students, token]);

  // Fetch results for selected student and subject
  useEffect(() => {
    if (!token || !selectedStudent || !selectedSubject) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/results/${selectedStudent}?subjectId=${selectedSubject}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(res.data);
        setError('');
      } catch {
        setError('Failed to load results data');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [selectedStudent, selectedSubject, token]);

  const getGrade = (marks) => {
    if (marks >= 90) return { grade: 'A+', color: 'var(--success)', bgColor: 'var(--success)20' };
    if (marks >= 80) return { grade: 'A', color: 'var(--success)', bgColor: 'var(--success)20' };
    if (marks >= 70) return { grade: 'B', color: 'var(--info)', bgColor: 'var(--info)20' };
    if (marks >= 60) return { grade: 'C', color: 'var(--warning)', bgColor: 'var(--warning)20' };
    if (marks >= 33) return { grade: 'D', color: 'var(--warning)', bgColor: 'var(--warning)20' };
    return { grade: 'F', color: 'var(--error)', bgColor: 'var(--error)20' };
  };

  const getStatusBadge = (marks) => {
    const isPassed = marks >= 33;
    return {
      text: isPassed ? 'Passed' : 'Failed',
      color: isPassed ? 'var(--success)' : 'var(--error)',
      bgColor: isPassed ? 'var(--success)20' : 'var(--error)20'
    };
  };

  const calculateStatistics = () => {
    if (results.length === 0) return null;
    
    const totalMarks = results.reduce((sum, result) => sum + result.marks, 0);
    const averageMarks = (totalMarks / results.length).toFixed(1);
    const highestMarks = Math.max(...results.map(result => result.marks));
    const lowestMarks = Math.min(...results.map(result => result.marks));
    const passedResults = results.filter(result => result.marks >= 33).length;
    
    return {
      averageMarks,
      highestMarks,
      lowestMarks,
      passedResults,
      totalResults: results.length
    };
  };

  const stats = calculateStatistics();

  const refreshData = async () => {
    if (!selectedStudent || !selectedSubject) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/results/${selectedStudent}?subjectId=${selectedSubject}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data);
      setSuccess('Results data refreshed successfully!');
      setError('');
    } catch {
      setError('Failed to refresh results data');
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedSubject('');
    setSelectedStudent('');
    setStudentDetails(null);
    setResults([]);
  };

  const selectedSubjectName = subjects.find(sub => sub._id === selectedSubject)?.name || 'Selected Subject';

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
                <span style={{ color: 'white', fontSize: '1.5rem' }}>📊</span>
              </div>
              <div>
                <h1 className="h2 mb-1" style={{ color: 'var(--text-primary)' }}>
                  Student Results
                </h1>
                <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                  View and analyze student performance
                </p>
              </div>
            </div>
            <button
              onClick={refreshData}
              disabled={loading || !selectedStudent || !selectedSubject}
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

      {/* Selection Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                Select Subject
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
                <option value="">-- Select Subject --</option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} {sub.classCode && `(${sub.classCode})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                Select Student
              </label>
              <select
                className="form-select"
                disabled={!students.length}
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '0.5rem'
                }}
              >
                <option value="">-- Select Student --</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} {student.rollNumber && `(${student.rollNumber})`}
                  </option>
                ))}
              </select>
              {!students.length && selectedSubject && (
                <div className="form-text" style={{ color: 'var(--text-secondary)' }}>
                  No students enrolled in this subject
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      {studentDetails && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {studentDetails.name}
                    </h5>
                    <div className="d-flex flex-wrap gap-3">
                      {studentDetails.rollNumber && (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          <strong>Roll No:</strong> {studentDetails.rollNumber}
                        </span>
                      )}
                      {studentDetails.email && (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          <strong>Email:</strong> {studentDetails.email}
                        </span>
                      )}
                      {studentDetails.department && (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          <strong>Department:</strong> {studentDetails.department}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <button
                      onClick={clearSelection}
                      className="btn"
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      Change Student
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>📈</div>
                <h3 style={{ color: 'var(--text-primary)' }}>{stats.averageMarks}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Average Marks</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <div style={{ fontSize: '2rem', color: 'var(--success)' }}>⭐</div>
                <h3 style={{ color: 'var(--text-primary)' }}>{stats.highestMarks}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Highest Marks</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <div style={{ fontSize: '2rem', color: 'var(--warning)' }}>📉</div>
                <h3 style={{ color: 'var(--text-primary)' }}>{stats.lowestMarks}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Lowest Marks</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <div style={{ fontSize: '2rem', color: 'var(--info)' }}>✅</div>
                <h3 style={{ color: 'var(--text-primary)' }}>{stats.passedResults}/{stats.totalResults}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Passed/Total</p>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Results Table */}
      {selectedStudent && selectedSubject && (
        <div className="card shadow-sm border-0">
          <div className="card-header" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
            <h5 className="card-title mb-0">
              <span style={{ marginRight: '0.5rem' }}>📋</span>
              Results for {selectedSubjectName}
              {studentDetails && (
                <span style={{ marginLeft: '1rem', fontSize: '0.875rem', opacity: 0.9 }}>
                  - {studentDetails.name}
                </span>
              )}
            </h5>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>📭</div>
                <h5 style={{ color: 'var(--text-secondary)' }}>No Results Found</h5>
                <p style={{ color: 'var(--text-secondary)' }}>
                  No results found for this student in {selectedSubjectName}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <tr>
                      <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Subject</th>
                      <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Marks</th>
                      <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Grade</th>
                      <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Status</th>
                      <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Comments</th>
                      <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Date</th>
                      <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => {
                      const grade = getGrade(result.marks);
                      const status = getStatusBadge(result.marks);
                      
                      return (
                        <tr key={result._id} style={{ borderColor: 'var(--border-light)' }}>
                          <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                            <strong>{result.subject?.name || 'N/A'}</strong>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div className="d-flex align-items-center gap-2">
                              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {result.marks}
                              </span>
                              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                / 100
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span 
                              style={{
                                backgroundColor: grade.bgColor,
                                color: grade.color,
                                padding: '0.375rem 0.75rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                border: `1px solid ${grade.color}`
                              }}
                            >
                              {grade.grade}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span 
                              style={{
                                backgroundColor: status.bgColor,
                                color: status.color,
                                padding: '0.375rem 0.75rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                border: `1px solid ${status.color}`
                              }}
                            >
                              {status.text}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                            <div style={{ maxWidth: '200px' }}>
                              {result.comments ? (
                                <>
                                  <span>{result.comments}</span>
                                  {result.comments.length > 30 && (
                                    <button 
                                      className="btn btn-sm btn-link p-0 ms-1"
                                      style={{ fontSize: '0.75rem' }}
                                      onClick={(e) => {
                                        e.target.previousSibling.style.whiteSpace = 
                                          e.target.previousSibling.style.whiteSpace === 'normal' ? 'nowrap' : 'normal';
                                        e.target.textContent = 
                                          e.target.textContent === 'more' ? 'less' : 'more';
                                      }}
                                    >
                                      more
                                    </button>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted">No comments</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                            {result.teacher?.name || 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;