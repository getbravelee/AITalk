import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://i12e102.p.ssafy.io/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
