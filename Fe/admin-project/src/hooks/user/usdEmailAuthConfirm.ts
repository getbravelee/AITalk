import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface EmailAuthResponse {
  message: string;
}
interface UseEmailAuthConfirmProps {
  onSuccess?: (data: EmailAuthResponse) => void;
  onError?: (error: any) => void;
}

export const useEmailAuthConfirm = ({onSuccess, onError}: UseEmailAuthConfirmProps = {}) => {
  const confirmEmail = async (email: string, code: string) => {
    try {
      console.log(email, code);
      const response = await axios.post<EmailAuthResponse>(
        'http://3.38.106.51:7001/user/verify-email',
        { email, code }
      );

      if (response.status === 200) {
        console.log(response.data);
        // 인증 성공 시 onSuccess 콜백 실행
        onSuccess && onSuccess(response.data);
      }
      return response;
    } catch (error) {
      console.error('인증 실패', error);
      onError && onError(error);
    }
  };

  return { confirmEmail };
};
