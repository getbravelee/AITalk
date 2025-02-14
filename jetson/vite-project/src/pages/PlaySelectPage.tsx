import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import CardTagButton from '../components/Buttons/CardTagButton';
import CameraButton from '../components/Buttons/CameraButton';
import AiTalkButton from '../components/Buttons/AiTalkButton';
import PlaySelectText from '../components/Texts/PlaySelectText';
import { RootState } from '../../feature/store';
import { useSelector } from 'react-redux';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';
import HomeButton from '../components/Common/HomeButton';
import { HStack } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import './PlaySelectPage.css';

export default function PlaySelectPage() {
  const location = useLocation()
  console.log(location.state.treatmentId)
  // 넘겨받은 treatmentId입니다. 
  const treatmentId: number = location.state.treatmentId
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  return (
    <div>
      <NavbarContainer>
        <HStack gap={370} pt={1}>
          <BackButton />
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
          {currentUser && (
            <HStack>
              <CurrentUserText />
              <LogoutButton />
              <HomeButton />
            </HStack>
          )}
        </HStack>
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
