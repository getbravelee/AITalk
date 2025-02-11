import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import ImgGenerateText from '../components/Texts/ImgGenerateText';
import LoadingCircle from '../components/Common/LoadingCircle';
import ImgGenerateImage from '../components/Images/ImgGenerateImage';

import './CameraImageGeneratePage.css';

export default function CameraImageGeneratePage() {
  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CameraImageGenerateContainer">
        <ImgGenerateText />
        <LoadingCircle className="camera-loading-circle" />
        <ImgGenerateImage />
      </div>
    </div>
  );
}
