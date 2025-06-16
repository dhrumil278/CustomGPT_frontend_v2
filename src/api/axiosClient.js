import axios from 'axios';
import toast from 'react-hot-toast';
console.log('process.env.REACT_APP_API_BASE_URL', process.env.REACT_APP_API_BASE_URL);

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Handle different error status codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - clear local storage and redirect to login
        localStorage.clear();
        window.location.href = '/login';
        break;
      case 403:
        toast.error('Access denied');
        break;
      case 422:
        // Validation errors are handled by the components
        return Promise.reject(error);
      default:
        toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient; 