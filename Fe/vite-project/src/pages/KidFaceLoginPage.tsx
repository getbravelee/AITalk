import { Text, HStack, Flex, Button, VStack, Box } from '@chakra-ui/react';
import { useState } from 'react';
import NavbarContainer from '../components/Common/NavbarContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';
import { useNavigate } from 'react-router-dom';
import '../components/Common/BackgroundContainer.css';
import BackButton from '../components/Common/BackButton';

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
      <Flex direction="column" align="center" gap={6}>
        <HStack>
          <Text fontSize={30} textAlign="center">
            아이
          </Text>
          <Text fontSize={20}> 의 얼굴을 인식해 주세요</Text>
        </HStack>
        <VStack>
          <CameraDialog
            isOpen={isCameraOpen}
            onClose={handleCloseCamera}
            title="아이 얼굴 인식"
            message="카메라로 이동합니다."
            from="kid_face"
          />
        </VStack>
        <VStack>
          <Button
            bg="blue.500"
            color="white"
            size={'sm'}
            _hover={{ bg: 'blue.600' }}
            _active={{ bg: 'blue.700' }}
            // fontSize={10}
            rounded="l3"
            onClick={() => {
              navigate('/KidSelectPage');
            }}
          >
            아이 직접 선택하기
          </Button>
          <Text fontSize={10}>아이 얼굴을 아직 등록하지 않았다면</Text>
          <HStack>
            <Text fontSize={10}>
              <Button
                bg="blue.500"
                color="white"
                size={'sm'}
                _hover={{ bg: 'blue.600' }}
                rounded="l3"
                onClick={() => {
                  navigate('/KidSelectPage');
                }}
              >
                등록
              </Button>
              을 먼저 진행해 주세요!
            </Text>
          </HStack>
        </VStack>
      </Flex>
    </div>
  );
}
