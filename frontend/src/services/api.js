import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Use relative URL in development (goes through Vite proxy at localhost:3000)
// Use explicit URL in production
const baseURL = API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For FormData (file uploads), delete Content-Type to let the browser set it with proper boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration or invalid token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;