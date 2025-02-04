import { Flex, HStack, Text, Input, VStack, Button } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';

export default function TherapistLoginPage() {
  return (
    <div>
      <NavbarContainer />
      <Flex direction="row" align="flex-start" pl={800} pt={150}>
        <HStack>
          <Text textStyle="7xl">치료사</Text>
          <Text textStyle="2xl"> 님의 ID, PW를 입력해 주세요</Text>
        </HStack>
      </Flex>
      <VStack align="stretch" pl={660} pt={200}>
        <Input placeholder="ID" size="lg" width={800} />
        <Input placeholder="Password" type="password" size="lg" width={800} />
        <Button colorScheme="teal" size="xl" width={800}>
          로그인
        </Button>
      </VStack>
    </div>
  );
}
