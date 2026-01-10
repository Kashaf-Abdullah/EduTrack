import axios from 'axios';
import API_BASE_URL from '../../config/api.js';

const BASE_URL = `${API_BASE_URL}/results`;

export const getResultsByStudent = async (studentId, token) => {
  const res = await axios.get(`${BASE_URL}/student/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addResult = async (resultData, token) => {
  const res = await axios.post(BASE_URL, resultData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
