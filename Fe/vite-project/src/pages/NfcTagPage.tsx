import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import LoadingCircle from '../components/Common/LoadingCircle';
import NfcImage from '../components/Images/NfcImage';
import NfcTagText from '../components/Texts/NfcTagText';

import './NfcTagPage.css';

export default function NfcTagPage() {
  return (
    <div>
      {/* NavbarContainer 내부에 BackButton을 children으로 전달 */}
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="NfcTagContainer">
        <LoadingCircle />
        <NfcImage />
        <NfcTagText />
      </div>
    </div>
  );
}
