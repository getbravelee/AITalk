import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import CardTagButton from '../components/Buttons/CardTagButton';
import CameraButton from '../components/Buttons/CameraButton';
import AiTalkButton from '../components/Buttons/AiTalkButton';
import PlaySelectText from '../components/Texts/PlaySelectText';

import './PlaySelectPage.css';

export default function PlaySelectPage() {
  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="PlaySelectContainer">
        <div className="PlaySelectInnerContainer">
          <CardTagButton />
          <CameraButton />
          <AiTalkButton />
        </div>
        <PlaySelectText />
      </div>
    </div>
  );
}
