import axios from 'axios';
import API_BASE_URL from '../../config/api.js';

const BASE_URL = `${API_BASE_URL}/subjects`;

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


export const getAllDetailStudentSuject = async (teacherId, token) => {
  const res = await axios.get(`${BASE_URL}/admin/students`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};