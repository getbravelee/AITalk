import { Flex, Text, Button, VStack, Center } from '@chakra-ui/react';
import BackgroundKidContainer from '../components/Common/BackgroundKidContainer';
import NavbarContainer from '../components/Common/NavbarContainer';
export default function TherapistFaceResisterCompletePage() {
  return (
    <div>
      <NavbarContainer />
      <BackgroundKidContainer>
        <Flex
          direction="column"
          align="flex-start"
          justify="center"
          minHeight="100vh"
          p={8}
          gap={30}
        >
          <VStack align="flex-start" spacing={6} mb={12}>
            <Text
              fontSize={{ base: '4xl', md: '5xl', lg: '7xl' }}
              fontWeight="bold"
            >
              얼굴 등록이 완료 됐어요!
            </Text>
            <Text fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} >
              얼굴 인식을 통해 로그인해 주세요
            </Text>
          </VStack>

          <Flex align="center">
            <Text fontSize="2xl">
              얼굴 인식으로
              <Button
                variant="link"
                color="blue.500"
                fontSize="2xl"
                fontWeight="normal"
                _hover={{ textDecoration: 'underline' }}
                aria-label="얼굴 인식으로 로그인하기"
              >
                로그인
              </Button>
              하러 가기!
            </Text>
          </Flex>
        </Flex>
      </BackgroundKidContainer>
    </div>
  );
}
