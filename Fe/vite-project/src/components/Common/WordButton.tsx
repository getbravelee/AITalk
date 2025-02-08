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

    // ✅ NFC 태그 요청 시작 (시간 제한 없이)
    console.log('📡 Waiting for second NFC tag data...');

    try {
      const response = await fetch(
        'http://127.0.0.1:5000/play/card-scan', // ✅ 시간 제한 제거!
      );

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
  };

  return (
    <button className="WordButton" onClick={handleClick}>
      <span>단어</span>
    </button>
  );
}
