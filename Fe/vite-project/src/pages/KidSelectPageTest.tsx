import { useEffect, useState } from 'react';
import NavbarContainer from '../components/Common/NavbarContainer';
import { Text } from '@chakra-ui/react';
import ChildCard from '../components/Cards/ChildCard';

interface ChildData {  
  id: number;
  name: string;
  age: number;
  profileImage: string;
  center:string
  // 기타 필드
}               

export default function KidSelectPage() {
  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState(false); // 로딩 상태 비활성화
  const [error, setError] = useState('');

  useEffect(() => {
    // 더미 데이터 직접 로드
    const dummyData: ChildData[] = [
      {
        id: 1,
        name: "김철수",
        age: 7,
        profileImage: "child1.jpg",
        center: "서울센터"
      },
      // ... 나머지 데이터 추가
    ];
    setChildren(dummyData);
    setLoading(false);
  }, []);

  return (
    <div>
      <NavbarContainer />
      <div className="BackgroundContainer">
        <Text fontSize={50} pt={5} pl={5}>
          아이 선택하기
        </Text>
        <div className="KidList">
          {children.map((child) => (
            <ChildCard key={child.id} data={child} />
          ))}
        </div>
      </div>
    </div>
  );
}
