import { Text, HStack, Flex, Button } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackgroundKidContainer from '../components/Common/BackgroundKidContainer';

export default function TherapistFaceLoginPage() {
  const faceIdImage: string = 'src/assets/Login/FaceID.png';

  return (
    <div>
      <NavbarContainer />
      <BackgroundKidContainer>
        <Flex direction="column" align="flex-start" gap={100}>
          <HStack>
            <Text textStyle="7xl">치료사</Text>
            <Text textStyle="2xl"> 님의 얼굴을 인식해 주세요</Text>
          </HStack>

          <Button
            bg="transparent"
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
          >
            <img src={faceIdImage} alt="얼굴인식" />
          </Button>
          <Text textStyle="2xl">
            ID, PW로
            <Button
              bg="transparent"
              color="blue.500"
              _hover={{ bg: 'transparent' }}
              _active={{ bg: 'transparent' }}
              fontSize={25}
            >
              로그인
            </Button>
            하기
          </Text>
        </Flex>
      </BackgroundKidContainer>
    </div>
  );
}
