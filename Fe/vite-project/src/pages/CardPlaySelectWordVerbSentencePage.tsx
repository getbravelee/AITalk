import { useLocation } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';

import './CardPlaySelectWordVerbPage.css';
import './CardPlaySelectWordVerbSentencePage.css';

export default function CardPlaySelectWordVerbSentencePage() {
  const location = useLocation();

  // ✅ `firstCard`와 `secondCard` 데이터를 받아옴
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

  // ✅ `secondCard.image + firstCard.image + ".png"` 형식으로 이미지 파일 경로 설정
  const combinedImageSrc = `/src/assets/card/${secondCard.image}${firstCard.image}.png`;

  // ✅ 텍스트를 "빵 먹다" 형식으로 조합
  const combinedCardName = `${firstCard.name} ${secondCard.name}`;

  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectWordVerbSentenceContainer">
        <CardInfoContainer
          className="LargeCardInfoContainer"
          imageSrc={combinedImageSrc}
          cardName={combinedCardName} // ✅ 조합된 텍스트 전달
        />
      </div>
    </div>
  );
}
