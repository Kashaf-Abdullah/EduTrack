
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext'; // adjust path if needed

function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { token } = useContext(AuthContext);

  // Fetch students and their subject enrollments
  const fetchStudentsDetails = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/subjects/admin/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching students details');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStudentsDetails();
  }, [token]);

  // Remove a student from a specific subject
  async function handleRemoveFromSubject(studentId, subjectId) {
    if (!window.confirm("Remove student from this subject?")) return;
    try {
      await axios.post(
        'http://localhost:5000/api/admin/remove-student-from-subject',
        { studentId, subjectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update state locally without reloading everything!
      setStudents(students =>
        students.map(student =>
          student.id === studentId
            ? {
                ...student,
                subjects: student.subjects.filter(sub => sub.id !== subjectId)
              }
            : student
        )
      );
      alert("Removed from subject.");
    } catch (err) {
      alert("Error removing from subject: " + (err.response?.data?.message || err.message));
    }
  }

  // Fully delete the user (all subjects, as before)
  async function handleDeleteStudent(studentId) {
    if (!window.confirm('Are you sure you want to delete this student? This will remove them from all subjects.')) return;
    setDeleteLoading(studentId);
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/student/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(students => students.filter(student => student.id !== studentId));
      alert('Student deleted successfully');
    } catch (err) {
      alert('Error deleting student: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleteLoading(null);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (students.length === 0) return <div>No students found.</div>;

  return (
    <div>
      <h2>All Students</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Enrolled Subjects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                {student.subjects.length === 0
                  ? 'None'
                  : student.subjects.map(sub => (
                      <span key={sub.id} style={{ marginRight: 8 }}>
                        {sub.name}
                        <button
                          onClick={() => handleRemoveFromSubject(student.id, sub.id)}
                          style={{
                            marginLeft: '4px',
                            fontSize: '12px',
                            background: '#900',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            padding: '2px 5px',
                            cursor: 'pointer'
                          }}
                        >Remove</button>
                        {','}
                      </span>
                    ))}
              </td>
              <td>
                <button
                  onClick={() => handleDeleteStudent(student.id)}
                  disabled={deleteLoading === student.id}
                  style={{
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: deleteLoading === student.id ? 'not-allowed' : 'pointer'
                  }}
                >
                  {deleteLoading === student.id ? 'Deleting...' : 'Delete User'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentsList;
