import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../feature/store';
import './WordButton.css';

interface WordButtonProps {
  targetPath: string;
  className?: string; // ✅ className을 받을 수 있도록 추가
}

export default function WordButton({
  targetPath,
  className = '',
}: WordButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const treatmentId = useSelector(
    (state: RootState) => state.treatment.treatmentId,
  );

  const scheduleId = treatmentId || location.state?.treatmentId;

  const handleClick = async (): Promise<void> => {
    if (!scheduleId) {
      console.error('❌ scheduleId is missing.');
      return;
    }

    console.log(`🔄 Navigating to ${targetPath}...`);

    const firstCardData = location.state?.firstCard ||
      location.state || {
        name: 'Unknown',
        image: 'default',
      };

    console.log('🔍 FirstCardData (Before Navigation):', firstCardData);

    navigate(targetPath, { state: { firstCard: firstCardData } });

    console.log('📡 Waiting for second NFC tag data...');

    try {
      const response = await fetch('http://127.0.0.1:5000/play/card-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduleId }),
      });

      if (!response.ok)
        throw new Error(`Failed to fetch data (Status: ${response.status})`);

      const secondCardData = await response.json();
      console.log('✅ Second NFC Tag Data:', secondCardData);

      navigate(`${targetPath}/verb`, {
        state: { firstCard: firstCardData, secondCard: secondCardData[0] },
      });
    } catch (error) {
      console.error('❌ Error fetching second card data:', error);
    }
  };

  return (
    <button
      className={`WordButton ${className}`}
      onClick={handleClick}
      disabled={!scheduleId}
    >
      <span>단어</span>
    </button>
  );
}
