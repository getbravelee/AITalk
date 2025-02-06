import { Button, Text, VStack, HStack, Flex } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import '../components/Common/BackgroundContainer.css'
import { useNavigate } from 'react-router-dom';

export default function HomeAfterLoginPage() {
  const eduKitImg: string = 'src/assets/AfterLogin/edu_kit.svg';
  const careSelectImg: string = 'src/assets/AfterLogin/care_select.svg';
  const kidSelectImg: string = 'src/assets/AfterLogin/kid_select.svg';
  const navigate = useNavigate()

  return (
    <div className='BackgroundContainer'>
      <NavbarContainer />
        <Flex direction='column' align='center' pt={250}>
          <HStack>
            <VStack gap={200}>
              <Button bg="transparent">
                <img src={eduKitImg} alt="교보재이미지" />
              </Button>
              <Text textStyle="3xl">
                교보재 보기 및 등록
              </Text>
            </VStack>
            <VStack gap={200}>
              <Button bg="transparent" onClick={() => (
                navigate('/KidSelectPage')
              )}>
                <img src={kidSelectImg} alt="카메라이미지" />
              </Button>
              <Text textStyle="3xl">
                아이 선택하기
              </Text>
            </VStack>
            <VStack gap={200}>
              <Button bg="transparent" onClick={() => (
                navigate('/MenuPage')
              )}>
                <img src={careSelectImg} alt="심볼이미지" />
              </Button>
              <Text textStyle="3xl">
                치료 시작하기
              </Text>
            </VStack>
          </HStack>
        </Flex>
    </div>
  );
}
