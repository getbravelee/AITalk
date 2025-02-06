import {
  Flex,
  HStack,
  Text,
  Input,
  VStack,
  Button,
  Box,
} from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';
import ResistCameraDialog from '../components/Dialogs/ResistCameraDialog';
import { useState } from 'react';
import '../components/Common/BackgroundContainer.css';
import BackButton from '../components/Common/BackButton';

export default function TherapistLoginPage() {
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
      <Flex direction="column" align="center" gap={3}>
        <HStack>
          <Text fontSize={30}>치료사</Text>
          <Text fontSize={20}> 님의 ID, PW를 입력해 주세요</Text>
        </HStack>
        <VStack align="center">
          <VStack>
            <Input
              placeholder="ID"
              size="sm"
              width={300}
              variant="subtle"
              rounded="2xl"
            />
            <Input
              placeholder="Password"
              type="password"
              size="sm"
              width={300}
              variant="subtle"
              rounded="2xl"
            />
          </VStack>
          <Box mb={1} />
          <Button
            colorScheme="teal"
            size="sm"
            width={300}
            backgroundColor="blue.500"
            rounded="2xl"
          >
            Login
          </Button>
        </VStack>
        <HStack>
          <Text fontSize={10}>Face ID로 로그인 하기</Text>
          <CameraDialog
            isOpen={isCameraOpen}
            onClose={handleCloseCamera}
            title="얼굴 인식"
            message="카메라로 이동합니다."
            isSmall={true}
          />
          <Text fontSize={10}>
            / 등록하기
            <ResistCameraDialog
              isOpen={isCameraOpen}
              onClose={handleCloseCamera}
              title="얼굴 등록"
              message="카메라로 이동합니다."
              isSmall={true}
            />
          </Text>
        </HStack>
      </Flex>
    </div>
  );
}
