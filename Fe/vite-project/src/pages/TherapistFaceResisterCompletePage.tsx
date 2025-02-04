import { Flex, Text, Button, VStack } from '@chakra-ui/react';

export default function TherapistFaceResisterCompletePage() {
  return (
    <div>
      <VStack direction="column" align="flex-start">
        <Flex pl={660} pt={200}>
          <Text textStyle="7xl">얼굴 등록이 완료 됐어요!</Text>
        </Flex>
        <Flex pl={780} pt={100}>
          <Text textStyle="4xl">얼굴 인식을 통해 로그인해 주세요</Text>
        </Flex>
      </VStack>
      <Flex direction="column" align="flex-start" pl={850} pt={100}>
        <Text textStyle="2xl">
          얼굴 인식으로
          <Button
            bg="transparent"
            color="blue.500"
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
            fontSize={25}
          >
            로그인
          </Button>
          하러 가기!
        </Text>
      </Flex>
    </div>
  );
}
