import { useNavigate } from 'react-router-dom';

export default function CardTagButton() {
  const navigate = useNavigate();

  const handleClick = async (): Promise<void> => {
    console.log('📡 Fetching card data from server...');

    // 먼저 `/nfc-tag`로 이동
    navigate('/nfc-tag');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 후 요청 자동 취소

    try {
      const response = await fetch(
        'http://192.168.30.193:5000/play/card-scan',
        { signal: controller.signal },
      );

      clearTimeout(timeoutId); // 응답이 왔으면 타이머 취소
      console.log('🔍 Server Response Status:', response.status);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch card data (Status: ${response.status})`,
        );
      }

      const cardData = await response.json();
      console.log('✅ Server Response Data:', cardData);

      navigate('/card-play-select', { state: cardData });
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
