import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import LoadingCircle from '../components/Common/LoadingCircle';
import NfcImage from '../components/Images/NfcImage';
import NfcTagText from '../components/Texts/NfcTagText';
import { RootState } from '../feature/store';
import { useSelector } from 'react-redux';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';
import { HStack } from '@chakra-ui/react';

import './NfcTagPage.css';

export default function NfcTagPage() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  return (
    <div className="BackgroundContainer">
      <div className="BackgroundImage"></div>
      {/* NavbarContainer 내부에 BackButton을 children으로 전달 */}
      <NavbarContainer>
        <HStack gap={315}>
          <BackPlaySelectButton className="CustomMarginTop" />
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
          {currentUser && (
            <HStack gap={10}>
              <CurrentUserText />
              <LogoutButton />
            </HStack>
          )}
        </HStack>
      </NavbarContainer>
      <div className="NfcTagContainer">
        <LoadingCircle />
        <NfcImage />
        <NfcTagText />
      </div>
    </div>
  );
}
