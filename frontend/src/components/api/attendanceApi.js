import axios from 'axios';
import API_BASE_URL from '../../config/api.js';

const BASE_URL = `${API_BASE_URL}/attendance`;

export const markAttendance = async (attendanceData, token) => {
  const res = await axios.post(BASE_URL, attendanceData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAttendanceBySubject = async (subjectId, token) => {
  const res = await axios.get(`${BASE_URL}/subject/${subjectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
