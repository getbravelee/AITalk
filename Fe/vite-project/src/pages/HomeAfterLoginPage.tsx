import { Button, Text, VStack, HStack } from '@chakra-ui/react';
import BackButton from '../components/Common/BackButton';

export default function HomeAfterLoginPage() {
  const eduKitImg: string = 'src/assets/AfterLogin/edu_kit.svg';
  const careSelectImg: string = 'src/assets/AfterLogin/care_select.svg';
  const kidSelectImg: string = 'src/assets/AfterLogin/kid_select.svg';
  return (
    <div>
      <BackButton />
      <HStack pt={250} pl={200} gap={20}>
        <VStack>
          <Button bg="transparent">
            <img src={eduKitImg} alt="교보재이미지" />
          </Button>
          <Text textStyle="3xl" pt={250}>교보재 보기 및 등록</Text>
        </VStack>
        <VStack>
          <Button bg="transparent">
            <img src={kidSelectImg} alt="카메라이미지" />
          </Button>
          <Text textStyle="3xl" pt={250}>아이 선택하기기</Text>
        </VStack>
        <VStack>
          <Button bg="transparent">
            <img src={careSelectImg} alt="심볼이미지" />
          </Button>
          <Text textStyle="3xl" pt={250}>치료 시작하기</Text>
        </VStack>
      </HStack>
    </div>
  );
}
