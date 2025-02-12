import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';

import './CameraPlaySelectThreeSentencePage.css';

export default function CameraPlaySelectThreeSentencePage() {
  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CameraPlaySelectThreeSentenceContainer">
        <CardInfoContainer
          className="LargeCardInfoContainer"
          imageSrc={'3어문 이미지 들어갈 곳'}
          cardName={'3어문 텍스트 들어갈 곳'}
        />
      </div>
    </div>
  );
}
