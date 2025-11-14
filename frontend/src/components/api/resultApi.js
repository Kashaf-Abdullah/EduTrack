import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/results';

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
