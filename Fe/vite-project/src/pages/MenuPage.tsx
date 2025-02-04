import { Button, Text, VStack, HStack } from '@chakra-ui/react';
import BackButton from '../components/Common/BackButton';

export default function MenuPage() {
  const cardImage: string = 'src/assets/menu/nfc_card.png';
  const cameraImage: string = 'src/assets/menu/camera.png';
  const symbolImage: string = 'src/assets/menu/symbol.png';
  return (
    <div>
      <BackButton />
      <HStack pt={250} pl={200} gap={20}>
        <VStack>
          <Button bg="transparent">
            <img src={cardImage} alt="NFC카드이미지" />
          </Button>
          <Text textStyle="3xl" pt={250}>카드 태그</Text>
        </VStack>
        <VStack>
          <Button bg="transparent">
            <img src={cameraImage} alt="카메라이미지지" />
          </Button>
          <Text textStyle="3xl" pt={250}>사진 찍기</Text>
        </VStack>
        <VStack>
          <Button bg="transparent">
            <img src={symbolImage} alt="심볼이미지" />
          </Button>
          <Text textStyle="3xl" pt={250}>톡톡이와 이야기 하기</Text>
        </VStack>
      </HStack>
      <Text pt={70} pl={670} textStyle='6xl'>오늘은 무엇을 하고 놀까요?</Text>
    </div>
  );
}
