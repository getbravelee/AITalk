import { useState } from 'react';
import { Flex, HStack, Text, VStack } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';
import BackgroundKidContainer from '../components/Common/BackgroundKidContainer';

export default function TherapistFaceResisterPage() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  return (
    <div>
      <NavbarContainer />
      <BackgroundKidContainer>
        <Flex direction="column" align="flex-start" gap={150}>
          <HStack>
            <Text textStyle="7xl">치료사</Text>
            <Text textStyle="2xl"> 님의 얼굴을 등록해 주세요</Text>
          </HStack>
          <VStack pl={200}>
            <CameraDialog isOpen={isCameraOpen} onClose={handleCloseCamera} />
          </VStack>
        </Flex>
      </BackgroundKidContainer>
    </div>
  );
}
