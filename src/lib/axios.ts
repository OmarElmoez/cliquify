
import refreshAccessToken from '@/services/refreshAccessToken';
import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV 
    ? '/api/v1'  
    : 'https://cliquifyapi.otomatika.tech/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    
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
axiosInstance.interceptors.response.use(
  (response) => response,
    async (error) => {
      const originalRequest = error.config
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const tokens = await refreshAccessToken()
          if (tokens) {
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
            originalRequest.headers['Authorization'] = `Bearer ${tokens.access}`; 
            return axiosInstance(originalRequest)
          }
        } catch (refreshError) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/'
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
);

export default axiosInstance;
