import { Flex, HStack, Text, Input, VStack, Button } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackgroundKidContainer from '../components/Common/BackgroundKidContainer';

export default function TherapistLoginPage() {
  return (
    <div>
      <NavbarContainer />
      <BackgroundKidContainer>
        <Flex direction="column" align="flex-start" gap={70}>
          <HStack>
            <Text textStyle="7xl">치료사</Text>
            <Text textStyle="2xl"> 님의 ID, PW를 입력해 주세요</Text>
          </HStack>
          <VStack align="stretch">
            <Input placeholder="ID" size="lg" width={800} />
            <Input
              placeholder="Password"
              type="password"
              size="lg"
              width={800}
            />
            <Button colorScheme="teal" size="xl" width={800}>
              로그인
            </Button>
          </VStack>
        </Flex>
      </BackgroundKidContainer>
    </div>
  );
}
