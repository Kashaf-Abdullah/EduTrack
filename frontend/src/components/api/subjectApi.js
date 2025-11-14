import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/subjects';

export const getSubjectsByTeacher = async (teacherId, token) => {
  const res = await axios.get(`${BASE_URL}/teacher/${teacherId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createSubject = async (subjectData, token) => {
  const res = await axios.post(BASE_URL, subjectData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
