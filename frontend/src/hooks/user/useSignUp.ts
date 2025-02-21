import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import {AxiosError} from 'axios';

interface SignUpData {
  name: string;
  id: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  email: string;
}

interface SignUpResponse {
  message: string;
}

/**
 * useSignUp Hook
 * 회원가입 요청을 수행하며, API 응답에 따라 상태를 관리합니다.
 */
const useSignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [data, setData] = useState<SignUpResponse | null>(null);
  const navigate = useNavigate();
  const signUp = async (
    signupData: SignUpData,
  ): Promise<SignUpResponse | void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<SignUpResponse>(
        '/user/signup',
        signupData,
      );

      // 회원가입 성공 시 상태(201)를 기준으로 데이터 업데이트
      if (response.status === 201) {
        setData(response.data);
        alert('회원가입 성공!');
        navigate('/');
      } else if (response.status === 400) {
        alert(`${response.data.message}`);
      }
      return response.data;
    } catch (err: any) {
      console.error('회원가입 실패:', err);
      alert(`${err.response.data.message}`);
      setError(err);
      // 에러를 재전파하여 호출 측에서 적절하게 처리할 수 있게 함
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    loading,
    error,
    data,
  };
};

export default useSignUp;
