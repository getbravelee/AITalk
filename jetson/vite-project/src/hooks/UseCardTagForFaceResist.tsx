import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../feature/user/userSlice';

const UseCardTagForFaceResist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.user.currentUser);

  const handleCardTagForFaceResist = useCallback(async () => {
    if (currentUser) {
      navigate('/TherapistFaceResisterPage', { state: currentUser });
      return;
    }

    console.log('📡 Fetching card data from server...');
    navigate('/NfcTagForFaceRegisterPage');

    try {
      // POST 요청 실행: 예시 데이터(tagInfo)를 서버로 전송하여 카드 데이터를 요청합니다.
      const response = await fetch('http://localhost:5000/user/card-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch card data (Status: ${response.status})`,
        );
      }

      const cardData = await response.json();
      console.log('✅ Server Response Data:', cardData);
      // 카드의 정보를 redux currentUser에 저장
      dispatch(setUser(cardData));

      navigate('/TherapistFaceResisterPage');
    } catch (error) {
      console.error('❌ Error fetching card data:', error);
    }
  }, [currentUser, navigate]);

  return handleCardTagForFaceResist;
};

export default UseCardTagForFaceResist;
