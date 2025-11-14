import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/announcements';

export const getAnnouncements = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createAnnouncement = async (data, token) => {
  const res = await axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
