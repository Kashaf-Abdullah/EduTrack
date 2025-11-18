import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const PublicInfoAdmin = () => {
  const { token } = useContext(AuthContext);
  const [publicInfos, setPublicInfos] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', visible: true });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/public-info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPublicInfos(res.data);
      } catch (err) {
        setError('Failed to load public info');
      }
    };
    if (token) fetchPublicInfo();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/public-info', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: '', description: '', visible: true });
      // Refresh list
      const res = await axios.get('http://localhost:5000/api/public-info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPublicInfos(res.data);
    } catch (err) {
      setError('Failed to add public info');
    }
  };

  const toggleVisibility = async (id, currentVisibility) => {
    try {
      await axios.put(
        `http://localhost:5000/api/public-info/${id}`,
        { visible: !currentVisibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPublicInfos((prev) =>
        prev.map((info) =>
          info._id === id ? { ...info, visible: !currentVisibility } : info
        )
      );
    } catch (err) {
      setError('Failed to update visibility');
    }
  };

  return (
    <div>
      <h2>Public Information Management (Admin)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br />
        <label>
          Visible:
          <input type="checkbox" name="visible" checked={form.visible} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Add Public Info</button>
      </form>
      <hr />
      <h3>Existing Public Info</h3>
      <ul>
        {publicInfos.map((info) => (
          <li key={info._id}>
            <strong>{info.title}</strong>: {info.description} -{' '}
            <button onClick={() => toggleVisibility(info._id, info.visible)}>
              {info.visible ? 'Hide' : 'Show'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicInfoAdmin;
