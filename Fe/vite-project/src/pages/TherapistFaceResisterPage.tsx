import { useState } from 'react';
import { Flex, HStack, Text, VStack } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';
import '../components/Common/BackgroundContainer.css'

export default function TherapistFaceResisterPage() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  return (
    <div className='BackgroundContainer' >
      <NavbarContainer />
        <Flex direction="column" align="center" gap={150} pt={180}>
          <HStack>
            <Text fontSize={100}>치료사</Text>
            <Text fontSize={30}> 님의 얼굴을 등록해 주세요</Text>
          </HStack>
          <VStack>
            <CameraDialog isOpen={isCameraOpen} onClose={handleCloseCamera} title='얼굴 등록' message='카메라로 연결됩니다.'/>
          </VStack>
        </Flex>
    </div>
  );
}
