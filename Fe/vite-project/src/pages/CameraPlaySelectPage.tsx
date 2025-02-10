import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import DetailPlaySelectText from '../components/Texts/DetailPlaySelectText';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import WordButton from '../components/Common/WordButton';
import ThreeSentenceButton from '../components/Common/ThreeSentenceButton';

import './CameraPlaySelectPage.css';

export default function CameraPlaySelectPage() {
  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CameraPlaySelectContainer">
        <DetailPlaySelectText />
        <div className="CameraPlaySelectInnerContainer">
          <div>
            <CardInfoContainer
              imageSrc={'/src/assets/card/bread.png'}
              cardName={'빵'}
            />
          </div>
          <div className="ButtonContainer">
            {/* CameraPlaySelectPage 전용 경로 설정 */}
            <WordButton targetPath="/camera-play-select/word" />
            <ThreeSentenceButton targetPath="/camera-play-select/three-sentence" />
          </div>
        </div>
      </div>
    </div>
  );
}
