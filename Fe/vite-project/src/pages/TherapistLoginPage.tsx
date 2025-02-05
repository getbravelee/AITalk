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
import BackgroundKidContainer from '../components/Common/BackgroundKidContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';
import { useState } from 'react';

export default function TherapistLoginPage() {
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
        <Flex direction="column" align="center" gap={70}>
          <HStack>
            <Text textStyle="7xl">치료사</Text>
            <Text textStyle="2xl"> 님의 ID, PW를 입력해 주세요</Text>
          </HStack>
          <VStack align="center">
            <VStack>
              <Input
                placeholder="ID"
                size="lg"
                width={800}
                variant="subtle"
                rounded="2xl"
              />
              <Input
                placeholder="Password"
                type="password"
                size="lg"
                width={800}
                variant="subtle"
                rounded="2xl"
              />
            </VStack>
            <Box mb={5} />
            <Button
              colorScheme="teal"
              size="xl"
              width={800}
              backgroundColor="blue.500"
              rounded='2xl'
            >
              Login
            </Button>
          </VStack>
          <HStack>
            <Text textStyle="2xl">Face ID로 로그인 하기</Text>
            <CameraDialog
              isOpen={isCameraOpen}
              onClose={handleCloseCamera}
              title="얼굴 인식"
              message="카메라로 이동합니다."
            />
          </HStack>
        </Flex>
      </BackgroundKidContainer>
    </div>
  );
}
