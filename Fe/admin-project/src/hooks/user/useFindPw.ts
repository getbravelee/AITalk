import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface FindPwResponse {
  message: string;
  // 필요한 경우 반환 값에 다른 필드도 포함시킬 수 있습니다.
}

export const useFindPw = () => {
  const navigate = useNavigate()
  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFindPw = async (): Promise<void> => {
    try {
      // API 엔드포인트에 name, id, phone을 payload로 전달합니다.
      const response = await axios.post<FindPwResponse>(
        'http://3.38.106.51:7001/user/find-pw',
        {
          name,
          id,
          email,
        }
      );

      if (response.status === 200) {
        // 서버 응답 성공 시 콘솔에 메시지를 출력하고, 필요에 따라 상태값 초기화
        console.log(response.data.message);
        navigate('/find-pw-reset')
        setErrorMessage('');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        // 404 에러를 예시로 처리 (서버에서 해당 조건에 맞춰 다른 에러코드를 반환할 경우 조건 수정)
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
    name,
    setName,
    id,
    setId,
    email,
    setEmail,
    errorMessage,
    handleFindPw,
  };
};
