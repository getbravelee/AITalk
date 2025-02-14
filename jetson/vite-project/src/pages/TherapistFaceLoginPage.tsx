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
import HomeButton from '../components/Common/HomeButton';

import UseFaceVerification from '../hooks/UseFaceVerification';

export default function TherapistFaceLoginPage() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const faceIdImageSmall: string = 'src/assets/Login/FaceID_small.svg';
  const navigate = useNavigate();
  const { verifyFace } = UseFaceVerification();

  return (
    <div className="BackgroundContainer">
      <NavbarContainer>
        <HStack gap={370} pt={1}>
          <BackButton />
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함 */}
          {currentUser && (
            <HStack>
              <CurrentUserText />
              <LogoutButton />
              <HomeButton />
            </HStack>
          )}
        </HStack>
      </NavbarContainer>
      <Flex direction="column" align="center" gap={5} pt={3}>
        <HStack className="font">
          <Text fontSize={50} textAlign="center">
            치료사
          </Text>
          <Text fontSize={30}> 님의 얼굴을 인식해 주세요</Text>
        </HStack>
        <VStack gap={10}>
          {/* 페이지 첫 마운트 시 얼굴인증 요청, 이후 아래의 버튼을 눌러 얼굴인증 재요청 */}
          <Button onClick={verifyFace}>
            <img src={faceIdImageSmall} alt="FaceID" />
          </Button>
          <Button
            bg="blue.400"
            color="white"
            _hover={{ bg: 'blue.500' }}
            _active={{ bg: 'blue.600' }}
            fontSize={20}
            rounded="l3"
            onClick={() => {
              navigate('/TherapistLoginPage');
            }}
            className="font"
          >
            ID/PW로 로그인 하기
          </Button>
        </VStack>
      </Flex>
    </div>
  );
}
