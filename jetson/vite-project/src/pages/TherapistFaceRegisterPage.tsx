import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Flex, HStack, Text, VStack, Button } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import '../components/Common/BackgroundContainer.css';
import BackButton from '../components/Common/BackButton';
import '../components/Texts/TextFontFromGoogle.css';
import { RootState } from '../feature/store';
import { useSelector } from 'react-redux';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';
import HomeButton from '../components/Common/HomeButton';
import UseFaceRegistration from '../hooks/UseFaceRegistration';

export default function TherapistFaceResisterPage() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const location = useLocation();
  console.log(location.state);
  const cardDataFromNFC = location.state || { id: 0, name: 'Unknown' };
  const faceIdImageSmall: string = 'src/assets/Login/FaceID_small.svg';
  const { registrationComplete } = UseFaceRegistration( {
    therapist_id: currentUser.therapist_id,
    therapist_name:  currentUser.therapist_name,
  });
  
  return (
    <div className="BackgroundContainer">
      <NavbarContainer>
        <HStack gap={370} pt={1}>
          <BackButton />
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함 */}
          {currentUser && (
            <HStack>
              <CurrentUserText />
              <LogoutButton />
              <HomeButton />
            </HStack>
          )}
        </HStack>
      </NavbarContainer>
      <Flex direction="column" align="center" pt={5} gap={7}>
        <HStack className="font">
          <Text fontSize={50}>치료사</Text>
          <Text fontSize={30}> 님의 얼굴을 등록해 주세요</Text>
        </HStack>
        <VStack>
          <Button onClick={alert('hello')}>
            <img src={faceIdImageSmall} alt="FaceID" />
          </Button>
        </VStack>
      </Flex>
    </div>
  );
}
