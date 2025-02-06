import { useNavigate, useLocation } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import NfcImage from '../components/Images/NfcImage';
import LoadingCircle from '../components/Common/LoadingCircle';
import NfcTagText from '../components/Texts/NfcTagText';

import './CardPlaySelectWordPage.css';

export default function CardPlaySelectWordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // NFC 태그 정보를 받아옴
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

  // 두 번째 NFC 태그 이후 다음 페이지로 이동
  const handleClick = (): void => {
    navigate('/card-play-select/word/verb', {
      state: { firstCard, secondCard },
    });
  };

  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectWordContainer">
        <div className="NfcLoadingWrapper" onClick={handleClick}>
          <NfcImage className="NfcCentered" />
          <LoadingCircle className="LoadingCentered" />
          <NfcTagText className="SmallNfcTagText" />
        </div>
        <div className="BigCardInfoContainer">
          <CardInfoContainer
            imageSrc={`/src/assets/card/${firstCard.image}.png`}
            cardName={firstCard.name}
          />
        </div>
      </div>
    </div>
  );
}
