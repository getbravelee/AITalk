import NavbarContainer from '../components/Common/NavbarContainer';
import CardTagButton from '../components/Buttons/CardTagButton';
import CameraButton from '../components/Buttons/CameraButton';
import AiTalkButton from '../components/Buttons/AiTalkButton';
import PlaySelectText from '../components/Texts/PlaySelectText';
import { RootState } from '../feature/store';
import { useSelector } from 'react-redux';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';
import { HStack } from '@chakra-ui/react';

import './PlaySelectPage.css';

export default function PlaySelectPage() {
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?.therapist_id,
  );
  const currentChild: string = useSelector((state: RootState) => {
    const id = state.child.currentChild?.child_id;
    return id !== undefined ? String(id) : '';
  });

  const currentScheduleId: number | null = useSelector((state: RootState) =>
    state.treatment?.treatmentId
      ? Number(state.treatment?.treatmentId) // 🔥 string을 number로 변환
      : null,
  );

  console.log('childId: ' + currentChild);
  console.log('therapistId: ' + currentUserId);
  console.log('scheduleId: ' + currentScheduleId);

  return (
    <div className="BackgroundContainer">
      <div className="BackgroundImage"></div>
      <NavbarContainer>
        <HStack pl={370}>
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
          {currentUserId && (
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
          <CameraButton
            className="PlayCameraButton"
            scheduleId={currentScheduleId ?? 0}
          />
          <AiTalkButton
            className="PlayAiTalkButton"
            childId={currentChild || 'unknown'}
          />
        </div>
        <PlaySelectText />
      </div>
    </div>
  );
}
