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

//   // Fetch subjects owned by teacher/admin
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/subjects', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const filteredSubjects = res.data.filter(sub =>
//           sub.teacher === user._id || (sub.teacher && sub.teacher._id === user._id)
//         );
//         setSubjects(filteredSubjects);
//       } catch (err) {
//         setError('Failed to load subjects');
//       }
//     };

//     if (token && user) fetchSubjects();
//   }, [token, user]);

//   // Fetch students when subject changes, from subject/details endpoint populated with students
//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (!selectedSubject) {
//         setStudents([]);
//         setSelectedStudent('');
//         return;
//       }
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/subjects/${selectedSubject}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setStudents(res.data.students || []);
//         // Reset selected student to force explicit choice
//         setSelectedStudent('');
//       } catch (err) {
//         setError('Failed to load students for selected subject');
//       }
//     };

//     if (token && selectedSubject) fetchStudents();
//   }, [selectedSubject, token]);

//   // Fetch results when both subject and student selected
//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!selectedStudent || !selectedSubject) {
//         setResults([]);
//         return;
//       }
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/results/${selectedStudent}?subjectId=${selectedSubject}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setResults(res.data);
//       } catch (err) {
//         setError('Failed to load results data');
//       }
//     };

//     if (token && selectedStudent && selectedSubject) fetchResults();
//   }, [selectedStudent, selectedSubject, token]);

//   return (
//     <div>
//       <h2>Results</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <label>
//         Select Subject:
//         <select
//           value={selectedSubject}
//           onChange={e => setSelectedSubject(e.target.value)}
//         >
//           <option value="">-- Select Subject --</option>
//           {subjects.map(sub => (
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
//           onChange={e => setSelectedStudent(e.target.value)}
//         >
//           <option value="">-- Select Student --</option>
//           {students.map(student => (
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
//             {results.map(result => (
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

  // Fetch subjects owned by this teacher/admin
  useEffect(() => {
    if (!token || !user) return;
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter subjects to only those owned by current user if teacher
        const filteredSubjects = res.data.filter(
          (sub) => sub.teacher === user._id || (sub.teacher && sub.teacher._id === user._id)
        );
        setSubjects(filteredSubjects);
      } catch {
        setError('Failed to load subjects');
      }
    };
    fetchSubjects();
  }, [token, user]);

  // Fetch students for selected subject
  useEffect(() => {
    if (!token || !selectedSubject) {
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
        setError('Failed to load students for selected subject');
      }
    };
    fetchStudents();
  }, [selectedSubject, token]);

  // Fetch results for selected student and subject
  useEffect(() => {
    if (!token || !selectedStudent || !selectedSubject) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/results/${selectedStudent}?subjectId=${selectedSubject}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(res.data);
      } catch {
        setError('Failed to load results data');
      }
    };
    fetchResults();
  }, [selectedStudent, selectedSubject, token]);

  return (
    <div>
      <h2>Results</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>
        Select Subject:
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">-- Select Subject --</option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      </label>

      <br />

      <label>
        Select Student:
        <select
          disabled={!students.length}
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Select Student --</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name}
            </option>
          ))}
        </select>
      </label>

      <br />

      {selectedStudent === '' ? (
        <p>Please select a student.</p>
      ) : results.length === 0 ? (
        <p>No results found for this student in this subject.</p>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>Comments</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result._id}>
                <td>{result.subject?.name || 'N/A'}</td>
                <td>{result.marks}</td>
                <td>{result.comments}</td>
                <td>{result.teacher?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Results;
