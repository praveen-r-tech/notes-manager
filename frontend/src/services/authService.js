import axios from './api';

const authService = {
  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  getCurrentUser: () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return { username, token };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;