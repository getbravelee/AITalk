import { useNavigate } from 'react-router-dom';

export default function CardTagButton() {
  const navigate = useNavigate();

  const handleClick = async (): Promise<void> => {
    console.log('📡 Fetching card data from server...');

    navigate('/nfc-tag');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 후 요청 자동 취소

    try {
      const response = await fetch(
        'http://192.168.30.206:5000/play/card-scan',
        { signal: controller.signal, credentials: 'include' },
      );
      clearTimeout(timeoutId);

      if (!response.ok)
        throw new Error(
          `Failed to fetch card data (Status: ${response.status})`,
        );

      const cardData = await response.json();
      console.log('✅ Server Response Data:', cardData);

      // NFC 태그 페이지로 이동 후 데이터를 받아오면 바로 card-play-select로 이동
      navigate('/nfc-tag');
      setTimeout(() => {
        navigate('/card-play-select', { state: cardData[0] });
      }, 2000); // 2초 후 이동 (로딩 화면 유지)
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
