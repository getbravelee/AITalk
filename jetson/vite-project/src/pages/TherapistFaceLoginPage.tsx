import { Text, HStack, Flex, Button, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import NavbarContainer from '../components/Common/NavbarContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';
import { useNavigate } from 'react-router-dom';
import '../components/Common/BackgroundContainer.css';
import BackButton from '../components/Common/BackButton';
import '../components/Texts/TextFontFromGoogle.css';
import { RootState } from '../feature/store';
import { useSelector } from 'react-redux';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';
import HomeButton from '../components/Common/HomeButton';

export default function TherapistFaceLoginPage() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const navigate = useNavigate();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  return (
    <div className="BackgroundContainer">
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
      <Flex direction="column" align="center" gap={5} pt={3}>
        <HStack className="font">
          <Text fontSize={50} textAlign="center">
            치료사
          </Text>
          <Text fontSize={30}> 님의 얼굴을 인식해 주세요</Text>
        </HStack>
        <VStack gap={10}>
          <CameraDialog
            isOpen={isCameraOpen}
            onClose={handleCloseCamera}
            title="얼굴 인식"
            message="카메라로 이동합니다."
            from="thera_face"
          />
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
