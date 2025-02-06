import { useNavigate } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import NfcImage from '../components/Images/NfcImage';
import LoadingCircle from '../components/Common/LoadingCircle';
import LoadingText from '../components/Texts/NfcTagText';

import './CardPlaySelectWordPage.css';

export default function CardPlaySelectWordPage() {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('/card-play-select/word/verb');
  };

  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectWordContainer">
        {/* NFC와 LoadingCircle을 감싸는 컨테이너 */}
        <div className="NfcLoadingWrapper" onClick={handleClick}>
          <NfcImage className="NfcCentered" />
          <LoadingCircle className="LoadingCentered" />
          <LoadingText />
        </div>
        <CardInfoContainer
          className="LargeCardInfoContainer"
          imageSrc="/src/assets/card/bread.png"
        />
      </div>
    </div>
  );
}
