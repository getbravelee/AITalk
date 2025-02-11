import { Text, HStack, Flex, Button, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import NavbarContainer from '../components/Common/NavbarContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';
import { useNavigate } from 'react-router-dom';
import '../components/Common/BackgroundContainer.css';
<<<<<<< HEAD
=======
import BackButton from '../components/Common/BackButton';
import '../components/Texts/TextFontFromGoogle.css';
>>>>>>> 2b6ad3ce5dafe6660ec4934b3a547ff5c5a2fc66

export default function TherapistFaceLoginPage() {
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
<<<<<<< HEAD
      <NavbarContainer />
      <Flex direction="column" align="center" gap={100}>
        <HStack>
          <Text fontSize={100} textAlign="center">
=======
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <Flex direction="column" align="center" gap={5} pt={3}>
        <HStack className="font">
          <Text fontSize={50} textAlign="center">
>>>>>>> 2b6ad3ce5dafe6660ec4934b3a547ff5c5a2fc66
            치료사
          </Text>
          <Text fontSize={30}> 님의 얼굴을 인식해 주세요</Text>
        </HStack>
<<<<<<< HEAD
        <VStack gap={130}>
=======
        <VStack gap={10}>
>>>>>>> 2b6ad3ce5dafe6660ec4934b3a547ff5c5a2fc66
          <CameraDialog
            isOpen={isCameraOpen}
            onClose={handleCloseCamera}
            title="얼굴 인식"
            message="카메라로 이동합니다."
<<<<<<< HEAD
          />
          <Button
            bg="blue.500"
            color="white"
            _hover={{ bg: 'blue.600' }}
            _active={{ bg: 'blue.700' }}
            fontSize={25}
=======
            from="thera_face"
          />
          <Button
            bg="blue.400"
            color="white"
            _hover={{ bg: 'blue.500' }}
            _active={{ bg: 'blue.600' }}
            fontSize={20}
>>>>>>> 2b6ad3ce5dafe6660ec4934b3a547ff5c5a2fc66
            rounded="l3"
            onClick={() => {
              navigate('/TherapistLoginPage');
            }}
<<<<<<< HEAD
=======
            className="font"
>>>>>>> 2b6ad3ce5dafe6660ec4934b3a547ff5c5a2fc66
          >
            ID/PW로 로그인 하기
          </Button>
        </VStack>
      </Flex>
    </div>
  );
}
