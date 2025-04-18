import { Text, HStack, Flex, Button, VStack, Box } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import { useNavigate } from 'react-router-dom';
import '../components/Common/BackgroundContainer.css';
import BackButton from '../components/Common/BackButton';
import '../components/Texts/TextFontFromGoogle.css';
import { RootState } from '../feature/store';
import { useSelector } from 'react-redux';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';
import UseFaceVerification from '../hooks/UseFaceVerification';
import {
  FaceIdAnimationLoading,
  FaceIdAnimationCheck,
} from '../components/FaceID/FaceIdAnimationLoading';

export default function TherapistFaceLoginPage() {
  const { isVerifying, isVerified, verifyFace } = UseFaceVerification();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const faceIdImage: string = 'images/login/FaceID.svg';
  const navigate = useNavigate();

  return (
    <div className="BackgroundContainer">
      <div className="BackgroundImage"></div>
      <NavbarContainer>
        <BackButton/>
        <HStack pl={350} >
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
          {currentUser && (
            <HStack gap={10}>
              <CurrentUserText />
              <LogoutButton />
            </HStack>
          )}
        </HStack>
      </NavbarContainer>
      <Flex direction="column" align="center">
        <HStack className="font">
          <Text fontSize={120} textAlign="center">
            치료사
          </Text>
          <Text fontSize={80}> 님의 얼굴을 인식해 주세요</Text>
        </HStack>
        <Box height="80px" />
        <VStack>
          {isVerifying ? (
            // 인증 진행 중에는 로딩 애니메이션(faceid_animation_1)을 보여줌
            <Flex direction="column" align="center">
              <FaceIdAnimationLoading />
            </Flex>
          ) : isVerified ? (
            // 인증 완료 후에는 체크 애니메이션(faceid_animation_2)을 보여줌
            <Flex direction="column" align="center">
              <FaceIdAnimationCheck />
            </Flex>
          ) : (
            // 초기 상태 - 인증 시작 전 UI
            <>
              <Button
                backgroundColor="transparent"
                onClick={async () => await verifyFace('t')}
              >
                <img src={faceIdImage} alt="FaceID" width={200} />
              </Button>
              <Box height="120px" />
              <Button
                bg="#b08b7a"
                color="white"
                height="80px"
                _hover={{ bg: '#9f7b69' }}
                _active={{ bg: '#8d6b5a' }}
                fontSize={60}
                rounded="3xl"
                onClick={() => navigate('/TherapistLoginPage')}
                className="font"
              >
                ID/PW로 로그인 하기
              </Button>
            </>
          )}
        </VStack>
      </Flex>
    </div>
  );
}
