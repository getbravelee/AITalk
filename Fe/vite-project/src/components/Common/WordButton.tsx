import { useNavigate, useLocation } from 'react-router-dom';

import './WordButton.css';

export default function WordButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = async (): Promise<void> => {
    console.log('🔄 Navigating to /card-play-select/word...');

    // ✅ 첫 번째 NFC 태그 데이터를 유지
    const firstCardData = location.state?.firstCard ||
      location.state || {
        name: 'Unknown',
        image: 'default',
      };
    console.log('🔍 FirstCardData (Before Navigation):', firstCardData);

    // ✅ 먼저 `/card-play-select/word`로 이동하며 첫 번째 카드 정보 전달
    navigate('/card-play-select/word', { state: { firstCard: firstCardData } });

    // 0.5초 뒤 NFC 태그 요청 시작 (UX 개선)
    setTimeout(async () => {
      console.log('📡 Fetching second NFC tag data...');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 후 자동 취소

      try {
        const response = await fetch(
          'http://192.168.30.206:5000/play/card-scan',
          { signal: controller.signal },
        );
        clearTimeout(timeoutId);

        if (!response.ok)
          throw new Error(`Failed to fetch data (Status: ${response.status})`);

        const secondCardData = await response.json();
        console.log('✅ Second NFC Tag Data:', secondCardData);

        // ✅ 첫 번째 카드 정보를 유지하면서 두 번째 카드 데이터 추가
        navigate('/card-play-select/word/verb', {
          state: { firstCard: firstCardData, secondCard: secondCardData[0] },
        });
      } catch (error) {
        console.error('❌ Error fetching second card data:', error);
      }
    }, 500); // 0.5초 후 API 호출
  };

  return (
    <button className="WordButton" onClick={handleClick}>
      <span>단어</span>
    </button>
  );
}
