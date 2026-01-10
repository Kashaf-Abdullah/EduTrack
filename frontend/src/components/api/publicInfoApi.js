import axios from 'axios';
import API_BASE_URL from '../../config/api.js';

const BASE_URL = `${API_BASE_URL}/public-info`;

export const getPublicInfo = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createPublicInfo = async (data, token) => {
  const res = await axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
