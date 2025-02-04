import './Home.css';
// import Title from '../components/Texts/MainTitle';
import { Button, VStack, Text } from '@chakra-ui/react';

export default function Home() {
  return (
    <div className="home">
      <VStack>
        <Text textStyle="7xl" pt={200}>
          아이톡
        </Text>
        <Text textStyle="6xl" pt={5}>
          (Ai Talk)
        </Text>
        <Text textStyle="2xl" pt={20}>
          놀이로 배우는 재미있는 언어치료
        </Text>
        <Button
          bg="blue.500"
          color="white"
          _hover={{ bg: 'blue.600' }}
          _active={{ bg: 'blue.700' }}
          fontSize={25}
          rounded="l3"
        >
          Face ID로 로그인 하기
        </Button>
        <Button
          bg="transparent"
          color="black"
          _hover={{ bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
          fontSize={20}
        >
          ID,PW로 로그인 하기
        </Button>
      </VStack>
    </div>
  );
}
