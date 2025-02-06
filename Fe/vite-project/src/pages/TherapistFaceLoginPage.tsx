import { Text, HStack, Flex, Button, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import NavbarContainer from '../components/Common/NavbarContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';
import { useNavigate } from 'react-router-dom';
import '../components/Common/BackgroundContainer.css';

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
      <NavbarContainer />
      <Flex direction="column" align="center" gap={100}>
        <HStack>
          <Text fontSize={100} textAlign="center">
            치료사
          </Text>
          <Text fontSize={30}> 님의 얼굴을 인식해 주세요</Text>
        </HStack>
        <VStack gap={130}>
          <CameraDialog
            isOpen={isCameraOpen}
            onClose={handleCloseCamera}
            title="얼굴 인식"
            message="카메라로 이동합니다."
          />
          <Button
            bg="blue.500"
            color="white"
            _hover={{ bg: 'blue.600' }}
            _active={{ bg: 'blue.700' }}
            fontSize={25}
            rounded="l3"
            onClick={() => {
              navigate('/TherapistLoginPage');
            }}
          >
            ID/PW로 로그인 하기
          </Button>
        </VStack>
      </Flex>
    </div>
  );
}
