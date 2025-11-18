// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const ManageSubjects = () => {
//   const { token } = useContext(AuthContext);
//   const [subjects, setSubjects] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/subjects', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSubjects(res.data);
//       } catch (err) {
//         setError('Failed to load subjects: ' + (err.response?.data?.message || err.message));
//       }
//     };
//     if (token) fetchSubjects();
//   }, [token]);

//   if (error) return <p>{error}</p>;

//   return (
//     <section>
//       <h2>Manage Subjects</h2>
//       <ul>
//         {Array.isArray(subjects) && subjects.length > 0 ? (
//           subjects.map((subject) => (
//             <li key={subject._id}>
//               {subject.name} (Teacher ID: {subject.teacher?.toString() || 'N/A'})
//             </li>
//           ))
//         ) : (
//           <p>No subjects found.</p>
//         )}
//       </ul>
//     </section>
//   );
// };

// export default ManageSubjects;

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const ManageSubjects = () => {
  const { token } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(res.data);
      } catch (err) {
        setError('Failed to load subjects: ' + (err.response?.data?.message || err.message));
      }
    };
    if (token) fetchSubjects();
  }, [token]);

  if (error) return <p>{error}</p>;

  return (
    <section>
      <h2>Manage Subjects</h2>
      {subjects.length === 0 ? (
        <p>No subjects found.</p>
      ) : (
        <ul>
          {subjects.map((subject) => (
            <li key={subject._id}>
              {subject.name} (Teacher: {subject.teacher?.name || subject.teacher?._id || 'N/A'})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ManageSubjects;
