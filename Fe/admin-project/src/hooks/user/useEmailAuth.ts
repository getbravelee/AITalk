import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface EmailAuthResponse {
  message: string;
}

export const useEmailVerify = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleEmailVerify = async (email: string): Promise<void> => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post<EmailAuthResponse>(
        'http://3.38.106.51:7001/user/send-verification-code',
        { id: email }
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
