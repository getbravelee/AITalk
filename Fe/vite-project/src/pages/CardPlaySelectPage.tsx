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

  // 확장자 붙여서 이미지 파일 경로 생성
  const imageSrc = `/src/assets/card/${cardData.image}.png`;

  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectContainer">
        <DetailPlaySelectText />
        <div className="CardPlaySelectInnerContainer">
          <div className="CardContainer">
            <CardInfoContainer imageSrc={imageSrc} />
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
