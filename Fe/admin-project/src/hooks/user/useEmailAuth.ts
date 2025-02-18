import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import axiosInstance from '../../utils/axiosInstance';

interface EmailAuthResponse {
  message: string;
}

export const useEmailVerify = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleEmailVerify = async (
    from: string,
    email: string,
    id: string,
  ): Promise<void> => {
    const url: string =
      from === 'signUp' ? 'send-email-verification' : 'send-verification-code';
    const payload = from === 'signUp' ? { email } : { id };
    setLoading(true);
    setErrorMessage('');
    console.log(payload);

    try {
      const response = await axiosInstance.post<EmailAuthResponse>(
        `/user/${url}`,
        payload,
      );

      if (response.status === 200) {
        console.log(response.data.message);
        // 인증 성공 후 추가 처리 (예: 사용자에게 알림)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response) {
          setErrorMessage(axiosError.response.data.message);
        } else {
          setErrorMessage('이메일 인증 중 오류가 발생했습니다.');
        }
      } else {
        setErrorMessage('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleEmailVerify, loading, errorMessage };
};
