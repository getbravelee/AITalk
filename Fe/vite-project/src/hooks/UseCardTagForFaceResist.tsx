import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
/**
UseCardTagForFaceResist hook
이 hook은 카드 태깅(예시용) API를 호출하여 얼굴 등록 처리를 위한 데이터를 받아오고,
이후 지정된 페이지로의 이동을 처리합니다.
작동 순서:
버튼 클릭 시, 먼저 /nfc-tag 페이지로 이동하여 NFC 태깅 진행 화면을 보여줍니다.
POST 요청을 보내 서버에서 카드 데이터를 받아옵니다.
요청은 10초 후 AbortController로 자동 취소됩니다.
응답이 정상적이면, 다시 /nfc-tag 페이지로 이동한 뒤 2초 후에
TherapistFaceResisterPage로 카드 데이터(therapist_id)를 상태에 담아 전송합니다.
오류가 발생하면 콘솔에 에러를 출력합니다.
@returns {Function} handleCardTagForFaceResist - 버튼 클릭 시 실행할 핸들러 함수.
*/
const UseCardTagForFaceResist = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const handleCardTagForFaceResist = useCallback(async () => {
    // 이미 1차 로그인 완료된 사용자라면 NFC 카드 태깅 없이 바로 얼굴 등록 페이지로 이동
    if (currentUser) {
      navigate('/TherapistFaceResisterPage',{ state: currentUser });
      return;
    }
    console.log('📡 Fetching card data from server...');
    // 1. NFC 태깅 진행 화면(예: 로딩 또는 NFC 태깅 화면)으로 이동합니다.
    navigate('/nfc-tag');

    // 2. 요청 취소를 위한 controller 생성 및 10초 후 자동 취소 타이머 설정
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 후 요청 자동 취소

    try {
      // 3. POST 요청 실행: 예시 데이터(tagInfo)를 서버로 전송하여 카드 데이터를 요청합니다.
      const response = await fetch('http://192.168.30.189:5000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagInfo: 'example-tag-info' }), // 실제 데이터로 변경 필요
        signal: controller.signal,
      });
      // 타이머 제거
      clearTimeout(timeoutId);

      // 4. 응답 상태가 비정상적이면 에러 발생
      if (!response.ok)
        throw new Error(
          `Failed to fetch card data (Status: ${response.status})`,
        );

      // 5. JSON 파싱 후 받은 데이터를 로그에 출력합니다.
      const cardData = await response.json();
      console.log('✅ Server Response Data:', cardData);

      // 6. NFC 태그 페이지로 다시 이동 후 2초 후 얼굴 등록 페이지로 전환합니다.
      navigate('/nfc-tag'); // NFC 태깅 페이지로 재이동 (로딩 효과)
      setTimeout(() => {
        // therapist_id 값을 상태에 담아 다음 페이지로 전송합니다.
        navigate('/TherapistFaceResisterPage', {
          state: cardData,
        });
      }, 2000); // 2초 후 이동
    } catch (error) {
      console.error('❌ Error fetching card data:', error);
    }
  }, [navigate]);
  return handleCardTagForFaceResist;
};
export default UseCardTagForFaceResist;
