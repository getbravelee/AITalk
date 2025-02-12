// src/pages/TherapistLoginPage.tsx
import { useState } from 'react';
import {
  Flex,
  HStack,
  Text,
  Input,
  VStack,
  Button,
} from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import CameraDialog from '../components/Dialogs/CameraDialog';
import BackButton from '../components/Common/BackButton';
import '../components/Common/BackgroundContainer.css';
import '../components/Texts/TextFontFromGoogle.css';
import UseTherapistLogin from '../hooks/UseTherapistLogin';
import { RootState } from '../../feature/store';
import { useSelector } from 'react-redux';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';
import HomeButton from '../components/Common/HomeButton';

export default function TherapistLoginPage() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  // 로그인 폼 관련 상태
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // 커스텀 훅으로 로그인 API 호출 로직 분리
  const { login, loginLoading, loginError } = UseTherapistLogin();

  // 얼굴 인식 및 등록 다이얼로그 제어 상태
  const [isFaceLoginCameraOpen, setFaceLoginCameraOpen] = useState(false);
  const [isFaceRegisterCameraOpen, setFaceRegisterCameraOpen] = useState(false);

  // 로그인 폼 제출 핸들러
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(id, password);
  };

  // 얼굴 인식 다이얼로그 오픈/클로즈 핸들러
  const handleOpenFaceLoginCamera = () => setFaceLoginCameraOpen(true);
  const handleCloseFaceLoginCamera = () => setFaceLoginCameraOpen(false);

  // 얼굴 등록 다이얼로그 오픈/클로즈 핸들러
  const handleOpenFaceRegisterCamera = () => setFaceRegisterCameraOpen(true);
  const handleCloseFaceRegisterCamera = () => setFaceRegisterCameraOpen(false);

  return (
    <div className="BackgroundContainer">
      {/* 네비게이션 바와 뒤로가기 버튼 */}
      <NavbarContainer>
        <HStack gap={370} pt={1}>
          <BackButton />
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
          {currentUser && (
            <HStack>
              <CurrentUserText />
              <LogoutButton />
              <HomeButton />
            </HStack>
          )}
        </HStack>
      </NavbarContainer>
      <Flex direction="column" align="center">
        {/* 상단 타이틀 */}
        <HStack className="font">
          <Text fontSize={50}>치료사</Text>
          <Text fontSize={30}> 님의 ID, PW를 입력해 주세요</Text>
        </HStack>
        {/* 로그인 폼 */}
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
            {loginError && (
              <Text color="red.500" fontSize={14} className="font">
                {loginError}
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
              isLoading={loginLoading}
            >
              Login
            </Button>
          </VStack>
        </form>
        {/* 얼굴 인식 및 등록 옵션 */}
        <HStack>
          <Text
            fontSize={20}
            className="font"
            onClick={handleOpenFaceLoginCamera}
            cursor="pointer"
          >
            Face ID로 로그인 하기
          </Text>
          <CameraDialog
            isOpen={isFaceLoginCameraOpen}
            onClose={handleCloseFaceLoginCamera}
            title="얼굴 인식"
            message="카메라로 이동합니다."
            isSmall={true}
            from="thera_face"
          />
        </HStack>
      </Flex>
    </div>
  );
}
