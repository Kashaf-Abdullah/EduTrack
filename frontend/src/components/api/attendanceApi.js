import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/attendance';

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
