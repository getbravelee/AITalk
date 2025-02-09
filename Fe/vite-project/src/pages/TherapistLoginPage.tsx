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
import '../components/Texts/TextFontFromGoogle.css';

interface LoginResponse {
  success: boolean;
  message: string;
}

export default function TherapistLoginPage() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };
  // 로그인 form 제출 핸들러
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = { id, password };

    try {
      const response = await fetch('http://192.168.30.146:5000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: LoginResponse = await response.json();

      if (data.success) {
        // 로그인 성공에 따른 후처리 (ex. 페이지 이동, 토큰 저장 등 추가적인 로직 처리 필요)
        // 예를들어 로그인이 성공하면 서버로부터 해당 유저의 id 값을 받아와
        // redux persist에 저장하여 추후에 계속 사용할 수 있다.
        console.log('로그인 성공:', data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('로그인 에러:', err);
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="BackgroundContainer">
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <Flex direction="column" align="center">
        <HStack className="font">
          <Text fontSize={50}>치료사</Text>
          <Text fontSize={30}> 님의 ID, PW를 입력해 주세요</Text>
        </HStack>
        {/* form 태그 내에 로그인 input 및 버튼을 배치 */}
        <form onSubmit={handleLoginSubmit}>
          <VStack align="center">
            <VStack>
              <Input
                placeholder="ID"
                size="sm"
                width={300}
                variant="subtle"
                rounded="2xl"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
              <Input
                placeholder="Password"
                type="password"
                size="sm"
                width={300}
                variant="subtle"
                rounded="2xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </VStack>
            {error && (
              <Text color="red.500" fontSize={14} className="font">
                {error}
              </Text>
            )}
            <Button
              type="submit"
              colorScheme="teal"
              size="sm"
              width={300}
              backgroundColor="blue.500"
              rounded="2xl"
              className="font"
              fontSize={30}
            >
              Login
            </Button>
          </VStack>
        </form>
        <HStack>
          <Text fontSize={20} className="font">
            Face ID로 로그인 하기
          </Text>
          <CameraDialog
            isOpen={isCameraOpen}
            onClose={handleCloseCamera}
            title="얼굴 인식"
            message="카메라로 이동합니다."
            isSmall={true}
            from="thera_face"
          />
          <Text fontSize={20} className="font">
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
