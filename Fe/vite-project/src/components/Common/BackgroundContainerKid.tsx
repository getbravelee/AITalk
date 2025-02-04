import '../../styles/BackgroundContainerKid.css';

import LoadingCircle from './LoadingCircle';
import NfcImage from '../Images/NfcImage';
import LoadingText from '../Texts/LoadingText';

function BackgroundContainerKid() {
  return (
    <div className="BackgroundContainerKid">
      <LoadingCircle />
      <NfcImage />
      <LoadingText />
    </div>
  );
}

export default BackgroundContainerKid;
