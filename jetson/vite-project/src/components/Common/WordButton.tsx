import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../feature/store';
import './WordButton.css';

interface WordButtonProps {
  targetPath: string; // 경로를 설정하는 prop
}

export default function WordButton({ targetPath }: WordButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Redux에서 treatmentId 가져옴 (scheduleId와 동일)
  const treatmentId = useSelector(
    (state: RootState) => state.treatment.treatmentId,
  );

  // ✅ `location.state`에서도 scheduleId 가져오기
  const scheduleId = treatmentId || location.state?.treatmentId;

  const handleClick = async (): Promise<void> => {
    if (!scheduleId) {
      console.error('❌ scheduleId is missing.');
      return;
    }

    console.log(`🔄 Navigating to ${targetPath}...`);

    // ✅ 첫 번째 NFC 태그 데이터를 유지
    const firstCardData = location.state?.firstCard ||
      location.state || {
        name: 'Unknown',
        image: 'default',
      };
    console.log('🔍 FirstCardData (Before Navigation):', firstCardData);

    // ✅ 경로로 이동
    navigate(targetPath, { state: { firstCard: firstCardData } });

    // ✅ NFC 태그 요청 시작 (시간 제한 없이)
    console.log('📡 Waiting for second NFC tag data...');

    try {
      const response = await fetch('http://127.0.0.1:5000/play/card-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduleId }), // ✅ 자동으로 받은 scheduleId 사용
      });

      if (!response.ok)
        throw new Error(`Failed to fetch data (Status: ${response.status})`);

      const secondCardData = await response.json();
      console.log('✅ Second NFC Tag Data:', secondCardData);

      // ✅ 첫 번째 카드 정보를 유지하면서 두 번째 카드 데이터 추가
      navigate(`${targetPath}/verb`, {
        state: { firstCard: firstCardData, secondCard: secondCardData[0] },
      });
    } catch (error) {
      console.error('❌ Error fetching second card data:', error);
    }
  };

  return (
    <button className="WordButton" onClick={handleClick} disabled={!scheduleId}>
      <span>단어</span>
    </button>
  );
}
