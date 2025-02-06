import { useLocation } from 'react-router-dom';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';

import DetailPlaySelectText from '../components/Texts/CardPlaySelectText';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import WordButton from '../components/Common/WordButton';
import ThreeSentenceButton from '../components/Common/ThreeSentenceButton';

import './CardPlaySelectPage.css';

export default function CardPlaySelectPage() {
  const location = useLocation();
  const cardData = location.state || { name: 'Unknown', image: 'default' };

  // 데이터가 배열이라면 첫 번째 요소 사용
  const parsedCardData = Array.isArray(cardData) ? cardData[0] : cardData;

  // 이미지 경로 설정
  const imageSrc = `/src/assets/card/${parsedCardData.image}.png`;

  console.log('🔍 Received Data:', location.state);

  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectContainer">
        <DetailPlaySelectText />
        <div className="CardPlaySelectInnerContainer">
          <div>
            <CardInfoContainer
              imageSrc={imageSrc}
              cardName={parsedCardData.name}
            />
          </div>
          <div className="ButtonContainer">
            <WordButton />
            <ThreeSentenceButton />
          </div>
        </div>
      </div>
    </div>
  );
}
