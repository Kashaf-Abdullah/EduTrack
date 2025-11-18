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
//           (sub) => sub.teacher === user._id || (sub.teacher && sub.teacher._id === user._id)
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
// const fetchResults = async () => {
//   // if (!user || !token || !user._id) {
//   //   console.log('Missing user, token, or user._id - User:', user, 'Token exists:', !!token);
//   //   return;
//   // }
  
//   try {
//     console.log('Fetching results for teacher ID:', user._id);
//     const res = await axios.get(`http://localhost:5000/api/results/teacher/${user.id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log("Results fetched successfully:", res.data);
//     console.log("Number of results:", res.data.length);
//     console.log("Results array:", res.data);
//     setResults(res.data);
//     setError('');
//   } catch (err) {
//     console.error('Error fetching results:', err);
//     console.error('Error response:', err.response);
//     setError('Failed to load results: ' + (err.response?.data?.message || err.message));
//   }
// };

// // Fetch all results assigned by this teacher


// useEffect(() => {
//   console.log('useEffect triggered - User:', user, 'Token exists:', !!token);
//   if (token && user && user._id) {
//     fetchResults();
//   } else {
//     console.log('Conditions not met for fetching results');
//   }
// }, [user, token]);

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
//       fetchResults();
//     } catch {
//       setError('Failed to save result');
//     }
//   };

//   return (
//     <div>
//       <h2>Teacher Dashboard</h2>
//       <h3>Assign Result</h3>
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
//         <table border="1" cellPadding="6" cellSpacing="0" style={{ marginTop: '10px' }}>
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

  // Fetch subjects when user and token ready
  useEffect(() => {
    if (!user || !token) return;
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredSubjects = res.data.filter(
          (sub) => sub.teacher === user.id || (sub.teacher && sub.teacher._id === user.id)
        );
        setSubjects(filteredSubjects);
      } catch {
        setError('Failed to load subjects');
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
        const res = await axios.get(`http://localhost:5000/api/subjects/${selectedSubject}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data.students || []);
        setSelectedStudent('');
      } catch {
        setError('Failed to load students');
      }
    };
    fetchStudents();
  }, [selectedSubject, token]);

  // Fetch all results assigned by this teacher
  const fetchResults = async () => {
    if (!user || !token || !user.id) {
      console.log('Missing user, token, or user.id - User:', user, 'Token exists:', !!token);
      return;
    }
    
    try {
      console.log('Fetching results for teacher ID:', user.id);
      const res = await axios.get(`http://localhost:5000/api/results/teacher/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Results fetched successfully:", res.data);
      console.log("Number of results:", res.data.length);
      setResults(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching results:', err);
      console.error('Error response:', err.response);
      setError('Failed to load results: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    console.log('useEffect triggered - User:', user, 'Token exists:', !!token);
    if (token && user && user.id) {
      fetchResults();
    } else {
      console.log('Conditions not met for fetching results');
    }
  }, [user, token]);

  // Submit new or updated result
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject || !selectedStudent) {
      setError('Please select subject and student');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/results',
        {
          subjectId: selectedSubject,
          studentId: selectedStudent,
          marks,
          comments,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMarks('');
      setComments('');
      setSelectedSubject('');
      setSelectedStudent('');
      fetchResults(); // Refresh the results table
    } catch {
      setError('Failed to save result');
    }
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <h3>Assign Result</h3>
      
      {/* Debug info */}
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '14px' }}>
        <strong>Debug Info:</strong> User ID: {user?.id || 'No user'}, Results: {results.length}
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Subject:
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Student:
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} disabled={!students.length}>
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Marks:
          <input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} />
        </label>
        <br />
        <label>
          Comments:
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
        </label>
        <br />
        <button type="submit" disabled={!selectedSubject || !selectedStudent}>Assign Result</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Given Results</h3>
      {results.length === 0 ? (
        <p>No results assigned yet.</p>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0" style={{ marginTop: '10px', width: '100%' }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Comments</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                <td>{r.student?.name || 'N/A'}</td>
                <td>{r.subject?.name || 'N/A'}</td>
                <td>{r.marks}</td>
                <td>{r.comments}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignResult;