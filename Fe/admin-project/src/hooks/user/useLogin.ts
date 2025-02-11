import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
  message: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = async (): Promise<void> => {
    try {
      const response = await axios.post<LoginResponse>('http://3.38.106.51:7001/user/login', { id, password });

      if (response.status === 200) {
        console.log(response.data.message);
        navigate('/main/home');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.status === 401) {
          setErrorMessage(axiosError.response.data.message);
        } else {
          console.log(error)
          setErrorMessage('로그인 중 오류가 발생했습니다.');
        }
      } else {
        setErrorMessage('네트워크 오류가 발생했습니다.');
      }
    }
  };

  return {
    id,
    setId,
    password,
    setPassword,
    errorMessage,
    handleLogin
  };
};
