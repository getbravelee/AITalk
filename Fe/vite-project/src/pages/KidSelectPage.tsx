import { Text, VStack, HStack, Flex, Box, Spinner } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import ChildCard from '../components/Cards/ChildCard';
import BackButton from '../components/Common/BackButton';
import '../components/Common/BackgroundContainer.css';
import '../components/Texts/TextFontFromGoogle.css';
import { UseFetch } from '../hooks/UseFetch';
import { ChunkArray } from '../utils/ChunkArray';
import { ChildData } from '../utils/ChunkArray'; // 혹은 types/child.ts에서 import

export default function KidSelectPage() {
  // useFetch 훅을 통해 API 데이터를 받아옴
  const { data: children, loading, error } = UseFetch<ChildData[]>('http://192.168.30.189:5000/child/list');
  
  // children 데이터가 있을 경우 그룹핑, 없으면 빈 배열 사용
  const groupedChildren = children ? ChunkArray(children, 2) : [];

  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="BackgroundContainer">
        <Text fontSize={30} pt={1} pl={3} className="font">
          아이 선택하기
        </Text>
        <Box height={3} />
        {loading ? (
          <Flex align="center" justify="center" minHeight="200px" direction="column" gap={4}>
            <Spinner size="xl" color="black" />
            <Text>로딩 중...</Text>
          </Flex>
        ) : error ? (
          <Flex align="center" justify="center" minHeight="200px">
            <Text color="black">{error}</Text>
          </Flex>
        ) : (
          <Flex direction="column" align="center" className="font">
            <VStack align="stretch" gap={10}>
              {groupedChildren.map((group, index) => (
                <HStack key={index} gap={10}>
                  {group.map(child => (
                    <ChildCard key={child.id} data={child} />
                  ))}
                </HStack>
              ))}
            </VStack>
          </Flex>
        )}
      </div>
    </div>
  );
}
