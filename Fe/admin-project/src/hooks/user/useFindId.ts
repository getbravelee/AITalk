import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface FindIdResponse {
  message: string;
  userId?: string;
}

export const useFindId = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFindId = async (): Promise<void> => {
    try {
      // API 요청 시 email만 전달
      const response = await axios.post<FindIdResponse>(
        'http://3.38.106.51:7001/user/find-id',
        { email }
      );
      if (response.status === 200) {
        // 성공 시 서버에서 userId를 email로 보내주기 때문에
        // 별도의 alert로 보여주지 않고, 필요 시 로그로 확인할 수 있음
        console.log(response.data.message);
        alert('회원님의 이메일로 ID를 전송했습니다.')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.status === 404) {
          setErrorMessage(axiosError.response.data.message);
        } else {
          setErrorMessage('아이디 찾기 중 오류가 발생했습니다.');
        }
      } else {
        setErrorMessage('네트워크 오류가 발생했습니다.');
      }
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    errorMessage,
    handleFindId,
  };
};
