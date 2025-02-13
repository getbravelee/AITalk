import React, { useState, useEffect } from 'react';
import './ChildListPage.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import CardContainer from '../../../components/main/child/CardContainer';

interface Child {
  childId: number;
  childName: string;
  protectorNumber: string;
  age: number; // API에서 age가 문자열로 온다면 string, 숫자면 number로 수정
  disabilityType: string;
  centerName: number;
}

export default function ChildListPage() {
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [error, setError] = useState<string>('');

  const handleAddChild = () => {
    navigate('/main/child/register');
  };

  useEffect(() => {
    axiosInstance
      .get<Child[]>('/child/list')
      .then((response) => {
        setChildren(response.data);
      })
      .catch((err) => {
        console.error('데이터 요청 실패:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      });
  }, []);

  return (
    <div className="child-list-container">
      <div className="header">
        <h1>치료 아동 관리</h1>
        <button className="add-child-button" onClick={handleAddChild}>
          + 아동 등록
        </button>
      </div>
      {error ? (
        <div className="error">{error}</div>
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
