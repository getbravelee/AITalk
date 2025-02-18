import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

interface FindPwResponse {
  message: string;
  // 필요한 경우 반환 값에 다른 필드도 포함시킬 수 있습니다.
}

export const useResetPw = () => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleResetPw = async (): Promise<void> => {
    if (!id || !password || !confirmPassword) {
      setErrorMessage('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axiosInstance.post<FindPwResponse>(
        '/user/change-password',
        { id, password, confirmPassword },
      );
      if (response.status === 200) {
        console.log(response.data.message);
        alert('비밀번호 재설정이 완료되었습니다.');
        setErrorMessage('');
        navigate('/user/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.status === 404) {
          setErrorMessage(axiosError.response.data.message);
        } else {
          setErrorMessage('비밀번호 변경 요청 중 오류가 발생했습니다.');
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
    confirmPassword,
    setConfirmPassword,
    errorMessage,
    handleResetPw,
  };
};
