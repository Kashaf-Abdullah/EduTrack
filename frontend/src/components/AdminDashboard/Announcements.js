import React, { useEffect, useState, useContext } from 'react';
import { getAnnouncements, createAnnouncement } from '../api/announcementApi';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const Announcements = () => {
  const { token } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]); // Holds students and teachers
  const [form, setForm] = useState({
    type: 'best-student',
    title: '',
    description: '',
    featuredUser: '',
    visible: true,
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await getAnnouncements();
      setAnnouncements(data);
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/approved', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (token) {
      fetchAnnouncements();
      fetchUsers();
    }
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
      await createAnnouncement(form, token);
      alert('Announcement created!');
      setForm({
        type: 'best-student',
        title: '',
        description: '',
        featuredUser: '',
        visible: true,
      });
      // Reload announcements list
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      alert('Error creating announcement: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <section>
      <h2>Manage Announcements</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="best-student">Best Student</option>
            <option value="best-teacher">Best Teacher</option>
          </select>
        </label>
        <br />
        <label>
          Title:
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Description:
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <br />
        <label>
          Featured User:
          <select name="featuredUser" value={form.featuredUser} onChange={handleChange} required>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Visible:
          <input type="checkbox" name="visible" checked={form.visible} onChange={handleChange} />
        </label>
        <br />
        <button type="submit" disabled={!form.featuredUser}>Create Announcement</button>
      </form>

      <h3>Existing Announcements</h3>
      <ul>
        {announcements.map((announcement) => (
          <li key={announcement._id}>
            {announcement.title} ({announcement.type}) - Featured user: {announcement.featuredUser?.name || announcement.featuredUser}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Announcements;
