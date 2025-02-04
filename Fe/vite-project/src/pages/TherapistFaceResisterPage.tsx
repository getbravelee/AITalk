import { useState } from 'react';
import { Flex, HStack, Text, Button } from '@chakra-ui/react';
import BackButton from '../components/Common/BackButton';
import CameraDialog from '../components/Dialogs/CameraDialog';

export default function TherapistFaceResisterPage() {
  const faceIdImage: string = 'src/assets/Login/FaceID.png';
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  return (
    <div>
      <BackButton />
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
