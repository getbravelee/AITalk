import { Text, HStack, Flex, Button, VStack } from '@chakra-ui/react';
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

export default function KidFaceLoginPage() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const navigate = useNavigate();
  const faceIdImageSmall: string = 'src/assets/Login/FaceID_small.svg';
  const { isVerifying, isVerified, verifyFace } = UseFaceVerification();
  return (
    <div className="BackgroundContainer">
      <NavbarContainer>
        <HStack gap={1300} pt={2}>
          <BackButton />
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
          {currentUser && (
            <HStack gap={10}>
              <CurrentUserText />
              <LogoutButton />
            </HStack>
          )}  
        </HStack>
      </NavbarContainer>
      <Flex direction="column" align="center" gap={5} pt={3}>
        <HStack className="font">
          <Text fontSize={200} textAlign="center">
            아이
          </Text>
          <Text fontSize={130}> 의 얼굴을 인식해 주세요</Text>
        </HStack>
        <VStack className="font" gap={10}>
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
            <Button
              backgroundColor="transparent"
              onClick={async () => await verifyFace('k')}
            >
              <img src={faceIdImageSmall} alt="FaceID" />
            </Button>
          )}
          <Button
            bg="#b08b7a"
            color="white"
            size={'sm'}
            _hover={{ bg: '#9f7b69' }}
            _active={{ bg: '#8d6b5a' }}
            fontSize={20}
            rounded="l3"
            onClick={() => {
              navigate('/KidSelectPage');
            }}
          >
            직접 선택하기
          </Button>
        </VStack>
      </Flex>
    </div>
  );
}
