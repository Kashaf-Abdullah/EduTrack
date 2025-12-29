// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const ViewResults = () => {
//   const { token, user } = useContext(AuthContext);
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (!token || !user) return;
//     const fetchResults = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/results/${user.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setResults(response.data);
//         setError('');
//       } catch {
//         setError('Failed to fetch results');
//       }
//     };
//     fetchResults();
//   }, [token, user]);

//   return (
//     <div>
//       <h2>Your Results</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {results.length === 0 ? (
//         <p>No results found.</p>
//       ) : (
//         <table border="1" cellPadding="6" cellSpacing="0" width="100%">
//           <thead>
//             <tr>
//               <th>Subject</th>
//               <th>Score</th>
//               <th>Comments</th>
//             </tr>
//           </thead>
//           <tbody>
//             {results.map((result) => (
//               <tr key={result._id}>
//                 <td>{result.subject?.name || 'N/A'}</td>
//                 <td>{result.marks}</td>
//               <td>
// {result.comments || 'N/A'}
// </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ViewResults;

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const ViewResults = () => {
  const { token, user } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('subject');

  useEffect(() => {
    if (!token || !user) return;
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/results/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(response.data);
        setError('');
      } catch {
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [token, user]);

  // Get unique subjects for filter
  const subjects = [...new Set(results
    .map(result => result.subject?.name)
    .filter(name => name)
  )];

  // Filter and sort results
  const filteredResults = results
    .filter(result => selectedSubject === 'all' || result.subject?.name === selectedSubject)
    .sort((a, b) => {
      switch (sortBy) {
        case 'subject':
          return (a.subject?.name || '').localeCompare(b.subject?.name || '');
        case 'marks-high':
          return b.marks - a.marks;
        case 'marks-low':
          return a.marks - b.marks;
        case 'date':
          return new Date(b.examDate || b.createdAt) - new Date(a.examDate || a.createdAt);
        default:
          return 0;
      }
    });

  // Calculate statistics
  const totalResults = results.length;
  const averageMarks = results.length > 0 
    ? (results.reduce((sum, result) => sum + result.marks, 0) / results.length).toFixed(1)
    : 0;
  const highestMarks = results.length > 0 
    ? Math.max(...results.map(result => result.marks))
    : 0;
  const passedResults = results.filter(result => result.marks >= 33).length;

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
    if (!token || !user) return;
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/results/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(response.data);
      setError('');
    } catch {
      setError('Failed to refresh results');
    } finally {
      setLoading(false);
    }
  };

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
                <span style={{ color: 'white', fontSize: '1.5rem' }}>🎓</span>
              </div>
              <div>
                <h1 className="h2 mb-1" style={{ color: 'var(--text-primary)' }}>
                  Academic Results
                </h1>
                <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                  View your examination results and performance
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
        <div className="col-md-3 mb-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>📊</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{totalResults}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Subjects</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--info)' }}>📈</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{averageMarks}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Average Marks</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--success)' }}>⭐</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{highestMarks}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Highest Marks</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--warning)' }}>✅</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{passedResults}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Passed Subjects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="subjectFilter" className="form-label" style={{ color: 'var(--text-primary)' }}>
            Filter by Subject
          </label>
          <select
            id="subjectFilter"
            className="form-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              border: '1px solid var(--border-light)',
              borderRadius: '0.5rem'
            }}
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="sortFilter" className="form-label" style={{ color: 'var(--text-primary)' }}>
            Sort by
          </label>
          <select
            id="sortFilter"
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              border: '1px solid var(--border-light)',
              borderRadius: '0.5rem'
            }}
          >
            <option value="subject">Subject Name</option>
            <option value="marks-high">Marks (High to Low)</option>
            <option value="marks-low">Marks (Low to High)</option>
            <option value="date">Date (Recent First)</option>
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span style={{ marginRight: '0.5rem' }}>⚠️</span>
          <div>{error}</div>
        </div>
      )}

      {/* Results Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
          <h5 className="card-title mb-0">
            <span style={{ marginRight: '0.5rem' }}>📋</span>
            Examination Results
          </h5>
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
              <h5 style={{ color: 'var(--text-secondary)' }}>No results found</h5>
              <p style={{ color: 'var(--text-secondary)' }}>
                {selectedSubject === 'all' 
                  ? "You don't have any results yet" 
                  : `No results found for ${selectedSubject}`
                }
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
                    <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Exam Date</th>
                    <th style={{ color: 'var(--text-primary)', border: 'none', padding: '1rem' }}>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result) => {
                    const { grade } = getGrade(result.marks);
                    const isPassed = result.marks >= 33;
                    
                    return (
                      <tr key={result._id} style={{ borderColor: 'var(--border-light)' }}>
                        <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                          <strong>{result.subject?.name || 'N/A'}</strong>
                          {result.subject?.code && (
                            <div>
                              <small className="text-muted">Code: {result.subject.code}</small>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div className="d-flex align-items-center">
                            <span style={{ 
                              color: 'var(--text-primary)', 
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                              marginRight: '0.5rem'
                            }}>
                              {result.marks}
                            </span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                              / 100
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={getGradeBadgeStyle(result.marks)}>
                            {grade}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span 
                            className={`badge ${isPassed ? 'bg-success' : 'bg-danger'}`}
                            style={{ fontSize: '0.8rem' }}
                          >
                            {isPassed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                          {result.examDate 
                            ? new Date(result.examDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'N/A'
                          }
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                          <div style={{ maxWidth: '200px' }}>
                            {result.comments ? (
                              <>
                                <span>{result.comments}</span>
                                {result.comments.length > 50 && (
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      {filteredResults.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <div className="card-body">
                <h6 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  <span style={{ marginRight: '0.5rem' }}>📈</span>
                  Performance Summary
                </h6>
                <div className="row text-center">
                  <div className="col-md-4">
                    <div style={{ color: getGrade(averageMarks).color, fontWeight: 'bold', fontSize: '1.25rem' }}>
                      {getGrade(averageMarks).grade}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Overall Grade
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>
                      {((passedResults / totalResults) * 100).toFixed(1)}%
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Pass Percentage
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div style={{ color: 'var(--info)', fontWeight: 'bold', fontSize: '1.25rem' }}>
                      {filteredResults.length}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Showing {filteredResults.length} of {totalResults} results
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewResults;