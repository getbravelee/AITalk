import { Text, HStack, Flex, Button, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import NavbarContainer from '../components/Common/NavbarContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';
import { useNavigate } from 'react-router-dom';
import '../components/Common/BackgroundContainer.css';
import BackButton from '../components/Common/BackButton';
import '../components/Texts/TextFontFromGoogle.css';

export default function KidFaceLoginPage() {
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
        <BackButton />
      </NavbarContainer>
      <Flex direction="column" align="center" gap={5} pt={3}>
        <HStack className="font">
          <Text fontSize={50} textAlign="center">
            아이
          </Text>
          <Text fontSize={30}> 의 얼굴을 인식해 주세요</Text>
        </HStack>
        <VStack className="font" gap={10}>
          <CameraDialog
            isOpen={isCameraOpen}
            onClose={handleCloseCamera}
            title="아이 얼굴 인식"
            message="카메라로 이동합니다."
            from="kid_face"
          />
          <Button
            bg="blue.400"
            color="white"
            size={'sm'}
            _hover={{ bg: 'blue.500' }}
            _active={{ bg: 'blue.600' }}
            fontSize={20}
            rounded="l3"
            onClick={() => {
              navigate('/KidSelectPage');
            }}
          >
            직접 선택하기
          </Button>
        </VStack>
      </Flex>
    </div>
  );
}
