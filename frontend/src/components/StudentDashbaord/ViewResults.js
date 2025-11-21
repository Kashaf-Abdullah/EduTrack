import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const ViewResults = () => {
  const { token, user } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !user) return;
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/results/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(response.data);
        setError('');
      } catch {
        setError('Failed to fetch results');
      }
    };
    fetchResults();
  }, [token, user]);

  return (
    <div>
      <h2>Your Results</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Score</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result._id}>
                <td>{result.subject?.name || 'N/A'}</td>
                <td>{result.marks}</td>
              <td>
{result.comments || 'N/A'}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewResults;
