import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';

import './CameraPlaySelectWordVerbPage.css';

export default function CameraPlaySelectWordVerbPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const firstCard = location.state?.firstCard || {
    name: 'Unknown',
    image: 'default',
  };
  const secondCard = location.state?.secondCard || {
    name: 'Unknown',
    image: 'default',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // ✅ `state`를 함께 넘겨줌
      navigate('/camera-play-select/word/verb/sentence', {
        state: { firstCard, secondCard },
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, firstCard, secondCard]); // ✅ firstCard, secondCard를 의존성 배열에 추가

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CameraPlaySelectWordVerbContainer">
        <CardInfoContainer
          imageSrc={`/src/assets/card/${firstCard.image}.png`}
          cardName={firstCard.name}
        />
        <div className="Plus">
          <p>+</p>
        </div>
        <CardInfoContainer
          imageSrc={`/src/assets/card/${secondCard.image}.png`}
          cardName={secondCard.name}
        />
      </div>
    </div>
  );
}
