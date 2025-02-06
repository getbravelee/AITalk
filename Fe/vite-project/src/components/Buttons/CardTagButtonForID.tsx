import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

export default function CardTagButtonForID() {
  const navigate = useNavigate();

  const handleClick = async (): Promise<void> => {
    console.log('📡 Fetching card data from server...');

    // 먼저 `/nfc-tag`로 이동
    navigate('/nfc-tag');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 후 요청 자동 취소

    try {
      const response = await fetch('http://192.168.30.206:5000/user/login', {
        method: 'POST', // POST 방식으로 요청
        headers: {
          'Content-Type': 'application/json', // JSON 형식의 요청 헤더
        },
        // 서버에서 요구하는 데이터 형식에 맞게 body 내용을 채워주세요.
        body: JSON.stringify({
          tagInfo: 'example-tag-info', // 예시 데이터, 실제 값으로 변경 필요
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok)
        throw new Error(
          `Failed to fetch card data (Status: ${response.status})`,
        );

      const cardData = await response.json();
      console.log('✅ Server Response Data:', cardData);

      // NFC 태그 페이지로 이동 후 데이터를 받아오면 바로 등록 페이지로 이동
      navigate('/nfc-tag');
      setTimeout(() => {
        navigate('/TherapistFaceResisterPage', { state: cardData[0] });
      }, 2000); // 2초 후 이동 (로딩 화면 유지)
    } catch (error) {
      console.error('❌ Error fetching card data:', error);
    }
  };

  return (
    <Button
      className="FaceIdRegistrationButton"
      onClick={() => handleClick()}
    >
      Face ID 등록하기
    </Button>
  );
}
