import { Text, VStack, HStack, Flex, Box, Spinner } from '@chakra-ui/react';
import NavbarContainer from '../components/Common/NavbarContainer';
import ChildCard from '../components/Cards/ChildCard';
import '../components/Common/BackgroundContainer.css';
import '../components/Texts/TextFontFromGoogle.css';
import { UseFetch } from '../hooks/UseFetch';
import { ChunkArray } from '../utils/ChunkArray';
import { ChildData } from '../utils/ChunkArray'; // 혹은 types/child.ts에서 import
import { RootState } from '../feature/store';
import { useSelector } from 'react-redux';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';

export default function KidSelectPage() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  // useFetch 훅을 통해 API 데이터를 받아옴
  const {
    data: children,
    loading,
    error,
  } = UseFetch<ChildData[]>('http://localhost:5000/child/list');

  // children 데이터가 있을 경우 그룹핑, 없으면 빈 배열 사용
  const groupedChildren = children ? ChunkArray(children, 2) : [];

  return (
    <div className="BackgroundContainer">
      <div className="BackgroundImage"></div>
      <NavbarContainer>
        <HStack pl={370}>
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
          {currentUser && (
            <HStack gap={10}>
              <CurrentUserText />
              <LogoutButton />
            </HStack>
          )}
        </HStack>
      </NavbarContainer>
      <Text fontSize={60} pt={1} pl={8} className="font" color="#333333">
        치료 아동 선택
      </Text>
      <Box height={3} />
      {loading ? (
        <Flex
          align="center"
          justify="center"
          minHeight="200px"
          direction="column"
          gap={4}
        >
          <Spinner size="xl" color="black" />
          <Text>로딩 중...</Text>
        </Flex>
      ) : error ? (
        <Flex align="center" justify="center" minHeight="200px">
          <Text color="black">{error}</Text>
        </Flex>
      ) : (
        <Flex direction="column" align="center" className="font">
          <VStack gap={10}>
            {groupedChildren.map((group, index) => (
              <HStack key={index} gap={10}>
                {group.map((child) => (
                  <ChildCard key={child.id} data={child} />
                ))}
              </HStack>
            ))}
          </VStack>
        </Flex>
      )}
    </div>
  );
}
