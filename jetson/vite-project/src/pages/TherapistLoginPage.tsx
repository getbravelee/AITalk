// src/pages/TherapistLoginPage.tsx
import { useState } from 'react';
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
import BackButton from '../components/Common/BackButton';
import '../components/Common/BackgroundContainer.css';
import '../components/Texts/TextFontFromGoogle.css';
import { RootState } from '../feature/store';
import { useSelector } from 'react-redux';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';
import { useNavigate } from 'react-router-dom';
import UseTherapistLogin from '../hooks/UseTherapistLogin';

export default function TherapistLoginPage() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const faceIdImage: string = 'images/login/FaceID.svg';
  const navigate = useNavigate();
  const { verifyLogin } = UseTherapistLogin();
  // 로그인 폼 관련 상태
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 폼 제출 핸들러
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await verifyLogin(id, password);
  };

  return (
    <div className="BackgroundContainer">
      <div className="BackgroundImage"></div>
      <NavbarContainer>
        <BackButton />
        <HStack pl={350}>
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
          {currentUser && (
            <HStack gap={10}>
              <CurrentUserText />
              <LogoutButton />
            </HStack>
          )}
        </HStack>
      </NavbarContainer>
      <Flex direction="column" align="center">
        {/* 상단 타이틀 */}
        <HStack className="font">
          <Text fontSize={120}>치료사</Text>
          <Text fontSize={80}> 님의 ID, PW를 입력해 주세요</Text>
        </HStack>
        {/* 로그인 폼 */}
        <form onSubmit={handleLoginSubmit}>
          <VStack align="center">
            <VStack>
              <Input
                placeholder="ID"
                backgroundColor="orange.200"
                size="2xl"
                width={800}
                variant="subtle"
                rounded="2xl"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
              <Input
                placeholder="Password"
                backgroundColor="orange.200"
                type="password"
                size="2xl"
                width={800}
                variant="subtle"
                rounded="2xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </VStack>
            <Box height={5} />
            <Button
              type="submit"
              colorScheme="teal"
              size="2xl"
              width={650}
              backgroundColor="#b08b7a"
              rounded="2xl"
              className="font"
              fontSize={80}
              color="ivory"
            >
              Login
            </Button>
          </VStack>
        </form>
        <Box height={5} />
        <HStack>
          <Text fontSize={80} className="font">
            Face ID로 로그인 하기
          </Text>
          <Button
            backgroundColor="transparent"
            onClick={() => navigate('/TherapistFaceLoginPage')}
          >
            <img src={faceIdImage} alt="FaceID" />
          </Button>
        </HStack>
      </Flex>
    </div>
  );
}
