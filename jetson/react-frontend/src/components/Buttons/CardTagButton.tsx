import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../feature/store';

interface CardTagButtonProps {
  className?: string; // 👈 className을 props로 받을 수 있도록 추가
}

export default function CardTagButton({ className }: CardTagButtonProps) {
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
      console.log('response 확인');
      if (!response.ok)
        throw new Error(
          `Failed to fetch card data (Status: ${response.status})`,
        );

      const cardData = await response.json();
      console.log('✅ Server Response Data:', cardData);
      const cardId = cardData[0].card_id;
      console.log('cardData: ' + cardData);
      console.log('cardId: ' + cardId);
      if (cardId >= 3000 && cardId <= 3999) {
        // ✅ 3000~3999: /card-play-select 이동
        navigate('/card-play-select', { state: cardData });
      } else if (cardId >= 1000 && cardId <= 1999) {
        // ✅ 1000~1999: /category-card-play-select 이동
        navigate('/category-card-play-select', { state: cardData });
      } else {
        console.log('🚫 Unsupported cardId range:', cardId);
      }
    } catch (error) {
      console.error('❌ Error fetching card data:', error);
    }
  };

  return (
    <button
      className={`CardTagButton ${className || ''}`}
      onClick={handleClick}
      disabled={!scheduleId}
    >
      <img src="/images/menu/nfc_card.png" alt="카드 태그 아이콘" />
      <span>카드 태그</span>
    </button>
  );
}
