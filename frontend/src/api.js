import axios from 'axios';

const API = axios.create({
  baseURL:
    process.env.NODE_ENV === 'test'          // <— Jest
      ? '/api'
      : process.env.REACT_APP_API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to all requests if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${String(token)}`;
  }
  return config;
});

export default API;