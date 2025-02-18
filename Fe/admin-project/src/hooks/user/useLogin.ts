import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';


interface LoginResponse {
  therapistId: number;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = async (): Promise<void> => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/user/login', {
        id,
        password,
      });

      if (response.status === 200) {
        const token = response.headers['authorization']; // 헤더에서 토큰 추출

        if (token) {
          localStorage.setItem('token', token); // 토큰 저장
          console.log('토큰 저장 완료:', token);
        } else {
          console.warn('토큰이 응답 헤더에 없습니다.');
        }

        const therapistId = response.data; // response.data는 숫자입니다.
        localStorage.setItem('therapistId', therapistId.toString());

        console.log('therapistId 저장 완료:', therapistId);

        navigate('/main/home');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.status === 401) {
          setErrorMessage(axiosError.response.data.message);
        } else if (axiosError.response?.status === 403) {
          setErrorMessage('접근이 거부되었습니다. 권한을 확인해 보세요.');
        } else {
          setErrorMessage('로그인 중 오류가 발생했습니다.');
        }
      }
    }
  };

  return {
    id,
    setId,
    password,
    setPassword,
    errorMessage,
    handleLogin,
  };
};
