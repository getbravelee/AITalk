import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import CardTagButton from '../components/Buttons/CardTagButton';
import CameraButton from '../components/Buttons/CameraButton';
import AiTalkButton from '../components/Buttons/AiTalkButton';
import PlaySelectText from '../components/Texts/PlaySelectText';
import { RootState } from '../feature/store';
import { useSelector } from 'react-redux';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';
import { HStack } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import './PlaySelectPage.css';

export default function PlaySelectPage() {
  const location = useLocation();

  // ✅ state로 전달받은 데이터
  const treatmentId: number = location.state?.treatment_id;
  const childId: string = location.state?.child_id;
  const therapistId: string = location.state?.therapist_id;

  // ✅ 콘솔에 데이터 출력
  console.log('📌 [PlaySelectPage] 전달받은 데이터');
  console.log(`  - scheduleId: ${treatmentId}`);
  console.log(`  - childId: ${childId} (typeof: ${typeof childId})`); // 🔍 타입까지 확인
  console.log(`  - therapistId: ${therapistId}`);

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  return (
    <div className="BackgroundContainer">
      <div className="BackgroundImage"></div>
      <NavbarContainer>
        <HStack pl={1200} pt={4}>
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
          {currentUser && (
            <HStack gap={10}>
              <CurrentUserText />
              <LogoutButton />
            </HStack>
          )}
        </HStack>
      </NavbarContainer>
      <div className="PlaySelectContainer">
        <div className="PlaySelectInnerContainer">
          <CardTagButton className="PlayCardTagButton" />
          <CameraButton className="PlayCameraButton" scheduleId={treatmentId} />
          <AiTalkButton className="PlayAiTalkButton" childId={childId} />
        </div>
        <PlaySelectText />
      </div>
    </div>
  );
}
