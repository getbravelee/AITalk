import NavbarContainer from '../components/Common/NavbarContainer';
import './CardPlaySelectPage.css';
import BackButton from '../components/Common/BackButton';
import CardTagButton from '../components/Buttons/CardTagButton';
import CameraButton from '../components/Buttons/CameraButton';
import AiTalkButton from '../components/Buttons/AiTalkButton';
import CardPlaySelectText from '../components/Texts/CardPlaySelectText';

export default function CardPlaySelectPage() {
  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectContainer">
        <div className="CardPlaySelectInnerContainer">
          <CardTagButton />
          <CameraButton />
          <AiTalkButton />
        </div>
        <CardPlaySelectText />
      </div>
    </div>
  );
}
