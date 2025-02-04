import { useState } from 'react';
import { Flex, HStack, Text } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';

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
      <Flex direction="row" align="flex-start" pl={800} pt={100}>
        <HStack>
          <Text textStyle="7xl">치료사</Text>
          <Text textStyle="2xl"> 님의 얼굴을 등록해 주세요</Text>
        </HStack>
      </Flex>
      <CameraDialog isOpen={isCameraOpen} onClose={handleCloseCamera}/>
    </div>
  );
}
