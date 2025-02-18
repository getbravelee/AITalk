import { useLocation } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import NfcImage from '../components/Images/NfcImage';
import LoadingCircle from '../components/Common/LoadingCircle';
import NfcTagText from '../components/Texts/NfcTagText';

import './CardPlaySelectWordPage.css';

export default function CardPlaySelectWordPage() {
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

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CardPlaySelectWordContainer">
        <div className="NfcLoadingsWrapper">
          <NfcImage className="SmallNfcCentered" />
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
