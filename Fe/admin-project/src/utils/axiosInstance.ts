import axios from 'axios';

// ✅ Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://localhost:7001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 요청 인터셉터로 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // ✅ 로컬 스토리지에서 토큰 불러오기
    if (token) {
      config.headers.Authorization = token; // ✅ Bearer 포함된 토큰 그대로 추가
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
