import { useNavigate } from 'react-router-dom';

export default function CardTagButton() {
  const navigate = useNavigate();

  const handleClick = async (): Promise<void> => {
    console.log('📡 Fetching card data from server...');

    navigate('/nfc-tag');

    try {
      const response = await fetch(
        'http://192.168.30.206:5000/play/card-scan', // ✅ 시간 제한 제거!
        { credentials: 'include' },
      );

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
    <button onClick={handleClick}>
      <img src="/src/assets/menu/nfc_card.png" alt="카드 태그 아이콘" />
      <span>카드 태그</span>
    </button>
  );
}
