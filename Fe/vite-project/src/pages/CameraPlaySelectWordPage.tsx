import { useNavigate, useLocation } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import NfcImage from '../components/Images/NfcImage';
import LoadingCircle from '../components/Common/LoadingCircle';
import NfcTagText from '../components/Texts/NfcTagText';

import './CameraPlaySelectWordPage.css';

export default function CameraPlaySelectWordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 사진으로 찍은 물체의 정보를 담아옴. 편하게 카드라는 이름으로 잡음
  const firstCard = location.state?.firstCard || {
    name: 'Unknown',
    image: 'default',
  };
  // NFC 태그 하면 여기 담을 것임임
  const secondCard = location.state?.secondCard || {
    name: 'Unknown',
    image: 'default',
  };

  const handleClick = (): void => {
    navigate('/camera-play-select/word/verb', {
      state: { firstCard, secondCard },
    });
  };
  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CameraPlaySelectWordContainer">
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
