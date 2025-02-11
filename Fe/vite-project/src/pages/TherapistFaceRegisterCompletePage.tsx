import { Flex, Text, HStack, VStack } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';
import { useState } from 'react';
import '../components/Common/BackgroundContainer.css';

export default function TherapistFaceResisterCompletePage() {
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
      <Flex direction="column" align="center" justify="center" gap={39}>
        <VStack>
          <Text
            fontSize={{ base: '4xl', md: '5xl', lg: '7xl' }}
            fontWeight="bold"
          >
            얼굴 등록이 완료 됐어요!!!
          </Text>
        </VStack>
        <HStack>
          <Text fontSize="2xl">얼굴 인식으로 로그인 하러 가기!</Text>
          <CameraDialog
            isOpen={isCameraOpen}
            onClose={handleCloseCamera}
            title="얼굴 인식"
            message="카메라로 이동합니다."
          />
        </HStack>
      </Flex>
    </div>
  );
}
