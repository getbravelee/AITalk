import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../feature/store';

export default function CardTagButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Redux에서 treatmentId 가져옴 (scheduleId와 동일)
  const treatmentId = useSelector(
    (state: RootState) => state.treatment.treatmentId,
  );

  // ✅ 만약 `location.state`에 treatmentId가 있다면 사용
  const scheduleId = treatmentId || location.state?.treatmentId;

  const handleClick = async (): Promise<void> => {
    if (!scheduleId) {
      console.error('❌ scheduleId is missing.');
      return;
    }

    console.log('📡 Fetching card data from server...');

    navigate('/nfc-tag');

    try {
      const response = await fetch('http://127.0.0.1:5000/play/card-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduleId }), // ✅ 자동으로 받은 scheduleId 사용
      });

      if (!response.ok)
        throw new Error(
          `Failed to fetch card data (Status: ${response.status})`,
        );

      const cardData = await response.json();
      console.log('✅ Server Response Data:', cardData);

      // ✅ NFC 태깅이 완료되면 즉시 `card-play-select`로 이동
      navigate('/card-play-select', { state: cardData[0] });
    } catch (error) {
      console.error('❌ Error fetching card data:', error);
    }
  };

  return (
    <button onClick={handleClick} disabled={!scheduleId}>
      <img src="/src/assets/menu/nfc_card.png" alt="카드 태그 아이콘" />
      <span>카드 태그</span>
    </button>
  );
}
