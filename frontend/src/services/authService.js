import axios from './api';

export const register = async (userData) => {
  const response = await axios.post('/api/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post('/api/auth/login', credentials);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

export const getCurrentUser = () => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  return { username, token };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};