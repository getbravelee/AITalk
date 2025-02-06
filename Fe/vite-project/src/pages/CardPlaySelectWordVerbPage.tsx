import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';

import './CardPlaySelectWordVerbPage.css';

export default function CardPlaySelectWordVerbPage() {
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

  console.log('🔍 First NFC Card:', firstCard);
  console.log('🔍 Second NFC Card:', secondCard);

  useEffect(() => {
    const timer = setTimeout(() => {
      // ✅ `state`를 함께 넘겨줌
      navigate('/card-play-select/word/verb/sentence', {
        state: { firstCard, secondCard },
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, firstCard, secondCard]); // ✅ firstCard, secondCard를 의존성 배열에 추가

  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectWordVerbContainer">
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
