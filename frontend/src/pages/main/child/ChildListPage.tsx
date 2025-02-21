import { useState, useEffect } from 'react';
import './ChildListPage.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import CardContainer from '../../../components/main/child/CardContainer';

interface Child {
  childId: number;
  childName: string;
  protectorNumber: string;
  age: number;
  disabilityType: string;
  centerName: string;
}

export default function ChildListPage() {
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // 🔍 검색어 상태 추가
  const [error, setError] = useState<string>('');
  const [notFound, setNotFound] = useState<boolean>(false); // ❌ 검색 결과 없을 때 상태

  // 🔹 아동 등록 페이지 이동
  const handleAddChild = () => {
    navigate('/main/child/register');
  };

  // 🔹 검색 API 요청
  const fetchChildren = async (query: string = '') => {
    try {
      setError(''); // 에러 초기화
      setNotFound(false); // 검색 결과 초기화

      const response = await axiosInstance.get<Child[]>(`/child/list${query ? `?childName=${query}` : ''}`);
      if (response.data.length === 0) {
        setNotFound(true); // ❌ 검색 결과 없음 상태 업데이트
      } else {
        setChildren(response.data);
      }
    } catch (err: any) {
      console.error('❌ 데이터 요청 실패:', err);
      if (err.response?.status === 400) {
        setNotFound(true); // 400 에러 발생 시 "아동이 존재하지 않습니다." 표시
      } else {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      }
    }
  };

  // 🔹 컴포넌트 마운트 시 전체 아동 불러오기
  useEffect(() => {
    fetchChildren();
  }, []);

  // 🔹 검색 버튼 클릭 시 API 호출
  const handleSearch = () => {
    fetchChildren(searchQuery);
  };

  // 🔹 Enter 키 입력 시 검색 실행
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="child-list-container">
      <div className="header">
        <h1>치료 아동 관리</h1>
        <div className="header-controls">
          {/* 🔍 검색 입력 필드 */}
          <input
            type="text"
            className="search-input"
            placeholder="아동 이름 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress} // Enter 입력 시 검색
          />
          {/* 🔍 검색 버튼 */}
          <button className="search-button" onClick={handleSearch}>
            검색
          </button>
          {/* ➕ 아동 등록 버튼 */}
          <button className="add-child-button" onClick={handleAddChild}>
            + 
          </button>
        </div>
      </div>

      {error ? (
        <div className="error">{error}</div>
      ) : notFound ? (
        <div className="not-found">해당 아동이 존재하지 않습니다.</div> // ❌ 검색 결과 없을 때 표시
      ) : (
        <div className="card-grid">
          {children.map((child) => (
            <CardContainer
              key={child.childId}
              id={child.childId}
              childName={child.childName}
              age={child.age}
              disabilityType={child.disabilityType}
              center={child.centerName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
