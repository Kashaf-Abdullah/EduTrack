import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getApprovedUsersByRole, impersonateUser } from '../api/userApi.js';

const TeachersList = () => {
  const navigate = useNavigate();
  const { token, impersonate } = useContext(AuthContext);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [impersonating, setImpersonating] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const data = await getApprovedUsersByRole('teacher', token);
        setTeachers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTeachers();
  }, [token]);

  const handleView = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleClose = () => {
    setSelectedTeacher(null);
  };

  const handleImpersonate = async (teacher) => {
    if (!window.confirm(`Impersonate ${teacher.name} as an admin? This will replace your current session temporarily.`)) {
      return;
    }
    try {
      setImpersonating(teacher.id);
      const data = await impersonateUser(teacher.id, token);
      impersonate(data.user, data.token, {
        user: { id: teacher.id, name: teacher.name, email: teacher.email, role: 'admin' },
        token
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to impersonate teacher');
    } finally {
      setImpersonating(null);
    }
  };

  if (loading) {
    return <div>Loading teachers...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>Approved Teachers</h2>
          <p>View all teacher profiles and impersonate for support/testing.</p>
        </div>
        <div style={{ fontSize: '0.95rem', color: '#666' }}>{teachers.length} teachers found</div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee' }}>Subjects</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                <td style={{ padding: '12px' }}>{teacher.name}</td>
                <td style={{ padding: '12px' }}>{teacher.email}</td>
                <td style={{ padding: '12px' }}>
                  {teacher.subjects?.length > 0 ? (
                    teacher.subjects.map((subject) => (
                      <div key={subject.id} style={{ marginBottom: '0.5rem' }}>
                        <strong>{subject.name}</strong>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                          {subject.classCode ? `Code: ${subject.classCode}` : 'No code'} • {subject.studentCount} students
                        </div>
                      </div>
                    ))
                  ) : (
                    <span style={{ color: '#888' }}>No subjects</span>
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => handleView(teacher)} style={{ marginRight: '0.5rem' }}>
                    View
                  </button>
                  <button
                    onClick={() => handleImpersonate(teacher)}
                    disabled={impersonating === teacher.id}
                    style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px' }}
                  >
                    {impersonating === teacher.id ? 'Impersonating...' : 'Impersonate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTeacher && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{selectedTeacher.name}</h3>
              <div style={{ color: '#666' }}>{selectedTeacher.email}</div>
            </div>
            <button onClick={handleClose} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer' }}>
              ×
            </button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Teacher ID:</strong> {selectedTeacher.id}</p>
            <p><strong>Subjects:</strong> {selectedTeacher.subjects?.length || 0}</p>
            {selectedTeacher.subjects?.map((subject) => (
              <div key={subject.id} style={{ marginBottom: '0.75rem' }}>
                <div><strong>{subject.name}</strong></div>
                <div style={{ color: '#666', fontSize: '0.95rem' }}>{subject.classCode ? `Code: ${subject.classCode}` : 'Code missing'}</div>
                <div style={{ color: '#666', fontSize: '0.95rem' }}>{subject.studentCount} students enrolled</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersList;
