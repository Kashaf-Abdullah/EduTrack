import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api.js';
import './ManagePendingSubjects.css';

const ManagePendingSubjects = () => {
  const { token } = useContext(AuthContext);
  const [pendingSubjects, setPendingSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectionReason, setRejectionReason] = useState({});

  const fetchPendingSubjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/subjects/admin/pending-subjects`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingSubjects(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching pending subjects:', err);
      setError('Failed to load pending subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSubjects();
  }, [token]);

  const approveSubject = async (subjectId, subjectName) => {
    try {
      setActionLoading(subjectId);
      await axios.post(
        `${API_BASE_URL}/subjects/${subjectId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`"${subjectName}" approved successfully!`);
      fetchPendingSubjects();
    } catch (err) {
      console.error('Error approving subject:', err);
      setError('Failed to approve subject');
    } finally {
      setActionLoading(null);
    }
  };

  const rejectSubject = async (subjectId, subjectName, reason) => {
    try {
      setActionLoading(subjectId);
      await axios.post(
        `${API_BASE_URL}/subjects/${subjectId}/reject`,
        { rejectionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`"${subjectName}" rejected`);
      setRejectionReason(prev => ({ ...prev, [subjectId]: '' }));
      fetchPendingSubjects();
    } catch (err) {
      console.error('Error rejecting subject:', err);
      setError('Failed to reject subject');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="manage-pending-subjects" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
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
          <span style={{ fontSize: '1.5rem' }}>📋</span>
        </div>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', color: 'var(--text-primary)' }}>
            Pending Subject Approvals
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Review and approve/reject new subjects created by teachers
          </p>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--error)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span> {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: 'var(--success)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>✅</span> {success}
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
            📚 Pending Subjects ({pendingSubjects.length})
          </h3>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border-light)',
                borderTop: '3px solid var(--primary)',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : pendingSubjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h4>No Pending Subjects</h4>
              <p>All subject requests have been approved or rejected!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {pendingSubjects.map(subject => (
                <div
                  key={subject._id}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                      {subject.name}
                    </h3>
                    <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <strong>Teacher:</strong> {subject.teacher?.name} ({subject.teacher?.email})
                    </p>
                    <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <strong>Description:</strong> {subject.description || 'N/A'}
                    </p>
                    {subject.courseContent && (
                      <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <strong>Course Content:</strong> {subject.courseContent}
                      </p>
                    )}
                    <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <strong>Requested:</strong> {new Date(subject.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <textarea
                      placeholder="Rejection reason (optional)"
                      value={rejectionReason[subject._id] || ''}
                      onChange={(e) => setRejectionReason(prev => ({
                        ...prev,
                        [subject._id]: e.target.value
                      }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-light)',
                        borderRadius: '6px',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        display: actionLoading === subject._id ? 'none' : 'block'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => approveSubject(subject._id, subject.name)}
                      disabled={actionLoading === subject._id}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--success)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: actionLoading === subject._id ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        opacity: actionLoading === subject._id ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {actionLoading === subject._id ? (
                        <>
                          <div style={{
                            width: '14px',
                            height: '14px',
                            border: '2px solid transparent',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          Processing...
                        </>
                      ) : (
                        <>✅ Approve</>
                      )}
                    </button>
                    <button
                      onClick={() => rejectSubject(subject._id, subject.name, rejectionReason[subject._id])}
                      disabled={actionLoading === subject._id}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--error)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: actionLoading === subject._id ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        opacity: actionLoading === subject._id ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {actionLoading === subject._id ? (
                        <>
                          <div style={{
                            width: '14px',
                            height: '14px',
                            border: '2px solid transparent',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          Processing...
                        </>
                      ) : (
                        <>❌ Reject</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ManagePendingSubjects;
