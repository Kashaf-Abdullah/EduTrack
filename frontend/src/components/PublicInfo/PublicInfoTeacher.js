import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const PublicInfoTeacher = () => {
  const { token } = useContext(AuthContext);
  const [publicInfos, setPublicInfos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/public-info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPublicInfos(res.data.filter(info => info.visible));
      } catch (err) {
        setError('Failed to load public info');
      }
    };
    if (token) fetchPublicInfo();
  }, [token]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Public Information (Teacher View)</h2>
      <ul>
        {publicInfos.length === 0 ? (
          <p>No public information available.</p>
        ) : (
          publicInfos.map((info) => (
            <li key={info._id}>
              <strong>{info.title}</strong>: {info.description}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PublicInfoTeacher;

