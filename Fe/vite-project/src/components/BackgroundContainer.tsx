import '../styles/BackgroundContainer.css';

import LoadingCircle from './LoadingCircle';
import NfcImage from './NfcImage';
import LoadingText from './LoadingText';

function BackgroundContainer() {
  return (
    <div className="BackgroundContainer">
      <LoadingCircle />
      <NfcImage />
      <LoadingText />
    </div>
  );
}

export default BackgroundContainer;
