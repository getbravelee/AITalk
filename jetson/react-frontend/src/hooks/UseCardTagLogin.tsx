import { useDispatch } from 'react-redux';
import { setUser } from '../feature/user/userSlice';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function UseCardTagLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [failedAttempts, setFailedAttempts] = useState(0);

  const cardLogin = useCallback(async () => {
    console.log('📡 서버로부터 카드 데이터를 가져옵니다...');

    // 로그인 진행 중 임시 페이지로 이동
    navigate('/NfcTagForLoginPage');

    try {
      const response = await fetch('http://localhost:5000/user/card-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);

      if (response.status === 404) {
        setFailedAttempts((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            // alert('3번 초과하여 인증에 실패했습니다. 인증 과정을 종료합니다.');
            navigate('/');
            return 0;
          } else {
            // alert('인증된 사용자가 아닙니다. 다른 카드를 사용해 주세요!');
            return newCount;
          }
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`서버 응답 오류 (Status: ${response.status})`);
      }

      const cardData = await response.json();
      console.log('✅ 서버 응답 데이터:', cardData);
      // 카드의 정보를 redux-persist에 저장
      dispatch(setUser(cardData));
      setFailedAttempts(0);
      // alert(`${cardData.therapist_name}님 안녕하세요!`);
      navigate('/KidFaceLoginPage');
    } catch (error: any) {
      // alert('인식된 사용자가 아닙니다. 다른 카드를 시도해주세요!');
      console.error('❌ 카드 데이터를 가져오는 중 에러 발생:', error);
    }
  }, [dispatch, navigate]);

  return { cardLogin, failedAttempts };
}
