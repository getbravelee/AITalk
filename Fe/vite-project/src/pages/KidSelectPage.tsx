import NavbarContainer from '../components/Common/NavbarContainer';
import { Text, VStack, HStack, Flex } from '@chakra-ui/react';
import '../components/Common/BackgroundContainer.css';
import { useEffect, useState } from 'react';
import ChildCard from '../components/Cards/ChildCard';

interface ChildData {
  id: number;
  name: string;
  age: number;
  profileImage: string;
  center: string;
  characteristic: string[];
  // 기타 필드
}

// 배열을 일정 크기로 묶는 유틸리티 함수
const chunkArray = (arr: ChildData[], size: number): ChildData[][] => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export default function KidSelectPage() {
  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 이후 api 연결 필요함
        // profileImage는 서버에 저장된 아이의 사진 데이터여야 함. url로 바로 접근 가능하도록.
        const response = await fetch('http://192.168.30.193:5000/child/list');
        const jsonData = await response.json();
        setChildren(jsonData);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setError('데이터 로드 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 필요하다면 로딩 및 에러 처리를 수행합니다.
  // if (loading) return <LoadingSpinner />;
  // if (error) return <ErrorAlert message={error} />;

  // children 배열을 2개씩 그룹핑
  const groupedChildren = chunkArray(children, 2);

  return (
    <div>
      <NavbarContainer />
      <div className="BackgroundContainer">
        <Text fontSize={50} pt={5} pl={5}>
          아이 선택하기
        </Text>
        <Flex direction="column" align="center">
          <VStack spacing={4} align="stretch">
            {/* 각 그룹을 HStack으로 묶어 가로 방향으로 정렬 */}
            {groupedChildren.map((group, index) => (
              <HStack key={index} gap={400}>
                {group.map((child) => (
                  <ChildCard key={child.child_id} data={child} />
                ))}
              </HStack>
            ))}
          </VStack>
        </Flex>
      </div>
    </div>
  );
}
