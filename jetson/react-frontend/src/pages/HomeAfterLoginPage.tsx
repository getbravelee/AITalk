import { Button, Text, VStack, HStack, Flex, Box } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import '../components/Common/BackgroundContainer.css';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/Common/BackButton';
import '../components/Texts/TextFontFromGoogle.css';

export default function HomeAfterLoginPage() {
  const eduKitImg: string = 'images/AfterLogin/edu_kit.svg';
  const careSelectImg: string = 'images/AfterLogin/care_select.svg';
  const kidSelectImg: string = 'images/AfterLogin/kid_select.svg';
  const navigate = useNavigate();

  return (
    <div className="BackgroundContainer">
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <Flex direction="column" className='font'>
        <HStack pt={20}>
          <VStack gap={12}>
            <Button bg="transparent">
              <img src={eduKitImg} alt="교보재이미지" />
            </Button>
            <Text fontSize={30}>교보재 보기 및 등록</Text>
          </VStack>
          <VStack gap={12}>
            <Button bg="transparent" onClick={() => navigate('/KidSelectPage')}>
              <img src={kidSelectImg} alt="카메라이미지" />
            </Button>
            <Text fontSize={30}>아이 선택하기</Text>
          </VStack>
          <VStack gap="60px">
            <Button bg="transparent" onClick={() => navigate('/play-select')}>
              <img src={careSelectImg} alt="심볼이미지" />
            </Button>
            <Text fontSize={30}>치료 시작하기</Text>
          </VStack>
        </HStack>
      </Flex>
    </div>
  );
}
