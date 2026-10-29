import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== 'undefined'
    ? '/api'
    : process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/api`
    : 'http://localhost:5000/api');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ------------------------------ Request Interceptor: Attach JWT Token ------------------------------
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nexachain_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------ Response Interceptor: Handle 401 Session Expiry ------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
      const isAuthRoute =
        window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthRoute) {
        localStorage.removeItem('nexachain_token');
        localStorage.removeItem('nexachain_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
