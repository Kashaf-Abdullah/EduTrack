import axios from 'axios';
import API_BASE_URL from '../../config/api.js';

const BASE_URL = `${API_BASE_URL}/users`;

export const getApprovedUsers = async (token) => {
  const res = await axios.get(`${BASE_URL}/approved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getApprovedUsersByRole = async (role, token) => {
  const res = await axios.get(`${BASE_URL}/approved/${role}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getPendingUsers = async (token) => {
  const res = await axios.get(`${BASE_URL}/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const impersonateUser = async (userId, token) => {
  const res = await axios.post(`${BASE_URL}/${userId}/impersonate`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getUserById = async (userId, token) => {
  const res = await axios.get(`${BASE_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
