import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { Button, VStack, Text, Flex, Box } from '@chakra-ui/react';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="HomeContainer">
      <Flex
        align="center"
        justify="center"
        direction="column"
        gap={10}
        pt={100}
      >
        <VStack>
          <Text fontSize={100}>아이톡</Text>
          <Text fontSize={100}>(Ai Talk)</Text>
        </VStack>
        <VStack gap={3}>
          <Text fontSize={50}>놀이로 배우는 재미있는 언어치료</Text>
          <Box height={50} />
          <Button
            bg="blue.500"
            color="white"
            _hover={{ bg: 'blue.600' }}
            _active={{ bg: 'blue.700' }}
            fontSize={25}
            rounded="l3"
            onClick={() => {
              navigate('/TherapistFaceLoginPage');
            }}
          >
            Face ID로 로그인 하기
          </Button>
          <Button
            bg="grey"
            color="white"
            _hover={{ bg: 'grey.600' }}
            _active={{ bg: 'grey.700' }}
            fontSize={25}
            rounded="l3"
            onClick={() => {
              navigate('/TherapistFaceResisterPage');
            }}
          >
            Face ID 등록하기
          </Button>
          <Box height={30} />
          <Button
            bg="transparent"
            color="black"
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
            fontSize={20}
            onClick={() => {
              navigate('/TherapistLoginPage');
            }}
          >
            ID,PW로 로그인 하기
          </Button>
        </VStack>
      </Flex>
    </div>
  );
}
