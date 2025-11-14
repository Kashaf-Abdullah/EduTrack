import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth';

export const login = async (credentials) => {
  const res = await axios.post(`${BASE_URL}/login`, credentials);
  return res.data;
};

export const register = async (userData) => {
  const res = await axios.post(`${BASE_URL}/register`, userData);
  return res.data;
};

// export const logout = async () => {
//   // Implement as per backend, e.g., clear token
// };

export const logout = async () => {
  // Clear any authentication tokens or user data stored in localStorage or sessionStorage
  localStorage.removeItem('token');   // or the key you store your JWT token with
  localStorage.removeItem('user');    // if you store user info separately

  // Optionally, you can also clear cookies or call backend logout API if exists

  // Since this is client-side logout, just resolving the promise here
  return Promise.resolve();
};
