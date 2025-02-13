import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
  // 필요한 경우, 로그인 응답 인터페이스를 업데이트하세요.
  // 서버에서 반환되는 therapistId는 본문에 있으므로 아래와 같이 타입을 지정할 수 있습니다.
  therapistId: number;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = async (): Promise<void> => {
    try {
      const response = await axios.post<LoginResponse>(

        'http://3.38.106.51:7001/user/login',
        { id, password },
      );


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
