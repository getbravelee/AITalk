import { Flex, HStack, Text, Button } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import '../components/Common/BackgroundContainer.css';
import BackButton from '../components/Common/BackButton';
import '../components/Texts/TextFontFromGoogle.css';
import { RootState } from '../feature/store';
import { useSelector } from 'react-redux';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';
import UseFaceRegistration from '../hooks/UseFaceRegistration';
import {
  FaceIdAnimationLoading,
  FaceIdAnimationCheck,
} from '../components/FaceID/FaceIdAnimationLoading';

import './CardPlaySelectPage.css';

export default function TherapistFaceResisterPage() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const faceIdImageSmall: string = 'images/login/FaceID_small.svg';
  const { isRegisting, isCompleted, registerFace } = UseFaceRegistration();

  const handleRegisterClick = () => {
    registerFace(
      currentUser?.therapist_id,
      currentUser?.therapist_name,
      't',
      0,
      '',
    );
  };

  return (
    <div className="BackgroundContainer">
      <div className="BackgroundImage"></div>
      <NavbarContainer>
        <HStack gap={1300} pt={2}>
          <BackButton className="CustomMarginBottom" />
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
          {currentUser && (
            <HStack gap={10}>
              <CurrentUserText />
              <LogoutButton />
            </HStack>
          )}
        </HStack>
      </NavbarContainer>
      <Flex direction="column" align="center" gap="100px">
        <HStack className="font">
          <Text fontSize={120}>치료사</Text>
          <Text fontSize={80}> 님의 얼굴을 등록해 주세요</Text>
        </HStack>
        {isRegisting ? (
          // 인증 진행 중에는 로딩 애니메이션(faceid_animation_1)을 보여줌
          <>
            <FaceIdAnimationLoading />
          </>
        ) : isCompleted ? (
          // 인증 완료 후에는 체크 애니메이션(faceid_animation_2)을 보여줌
          <FaceIdAnimationCheck />
        ) : (
          // 초기 상태 - 인증 시작 전 UI
          <Button backgroundColor="transparent" onClick={handleRegisterClick}>
            <img src={faceIdImageSmall} alt="FaceID" width={200} />
          </Button>
        )}
      </Flex>
    </div>
  );
}
