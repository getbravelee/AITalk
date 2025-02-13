import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Flex, HStack, Text, VStack } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import ResistCameraDialog from '../components/Dialogs/ResistCameraDialog';
import '../components/Common/BackgroundContainer.css';
import BackButton from '../components/Common/BackButton';
import '../components/Texts/TextFontFromGoogle.css';

export default function TherapistFaceResisterPage() {
  const location = useLocation();
  const cardDataFromNFC = location.state || { id: 0, name: 'Unknown' };
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
        <BackButton />
      </NavbarContainer>
      <Flex direction="column" align="center" pt={5} gap={7}>
        <HStack className="font">
          <Text fontSize={50}>치료사</Text>
          <Text fontSize={30}> 님의 얼굴을 등록해 주세요</Text>
        </HStack>
        <VStack>
          <ResistCameraDialog
            isOpen={isCameraOpen}
            onClose={handleCloseCamera}
            title="얼굴 등록"
            message="카메라로 연결됩니다."
            from="thera_face"
            // therapistID={cardDataID}
            cardData={cardDataFromNFC} // NFC 카드 정보를 전달
          />
        </VStack>
      </Flex>
    </div>
  );
}
