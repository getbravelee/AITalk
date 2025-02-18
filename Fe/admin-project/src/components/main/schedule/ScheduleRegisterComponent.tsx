import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import './ScheduleRegisterComponent.css';

interface ScheduleRegisterProps {
  date: Date;
  onClose: () => void; // 모달 닫기 함수 추가
}

const ScheduleRegisterComponent = ({
  date,
  onClose,
}: ScheduleRegisterProps) => {
  const [children, setChildren] = useState<
    { childId: number; childName: string; centerName: string }[]
  >([]);
  const [selectedChild, setSelectedChild] = useState(''); // 선택된 아동 ID
  const [center, setCenter] = useState(''); // 센터 정보
  const [startTime, setStartTime] = useState(''); // 시작 시간
  const [endTime, setEndTime] = useState(''); // 종료 시간
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 추가

  // 날짜를 `YYYY-MM-DD` 형식으로 변환 (UTC 시간 문제 해결)
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDate(date);

  // 아동 리스트 API 호출
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await axiosInstance.get('/child/list');
        console.log('📥 아동 목록 응답:', response.data);
        setChildren(response.data);
      } catch (error) {
        console.error('❌ 아동 목록 API 호출 실패:', error);
      }
    };

    fetchChildren();
  }, []);

  // ✅ 아동 선택 시 센터 자동 입력
  const handleChildSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChildId = e.target.value;
    setSelectedChild(selectedChildId);

    const selectedChildData = children.find(
      (child) => child.childId.toString() === selectedChildId,
    );
    if (selectedChildData) {
      setCenter(selectedChildData.centerName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      childId: Number(selectedChild),
      treatmentDate: formattedDate,
      startTime: startTime + ':00',
      endTime: endTime + ':00',
    };

    console.log('📅 일정 등록 데이터:', requestData);

    try {
      const response = await axiosInstance.post(
        '/schedule/register',
        requestData,
      );
      console.log('일정 등록 성공:', response.data);
      alert('일정이 성공적으로 등록되었습니다.');

      // 모달창 닫기
      onClose();

      // `/main/schedule`로 이동 후 **페이지 새로고침**
      navigate('/main/schedule');
      window.location.reload(); // 새로고침 추가
    } catch (error) {
      console.error('❌ 일정 등록 실패:', error);
      alert('일정 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>스케줄 등록</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="schedule-form">
          {/*아동 선택 */}
          <label>아동 선택</label>
          <select value={selectedChild} onChange={handleChildSelect} required>
            <option value="">아동 선택</option>
            {children.map((child) => (
              <option key={child.childId} value={child.childId}>
                {child.childName}
              </option>
            ))}
          </select>

          {/*센터 입력 (자동 입력) */}
          <label>센터</label>
          <input type="text" value={center} readOnly />

          {/* 클릭한 날짜 자동 입력 */}
          <label>일자</label>
          <input type="text" value={formattedDate} readOnly />

          {/* 시작 시간 입력 */}
          <label>시작 시간</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />

          {/* 종료 시간 입력 */}
          <label>종료 시간</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />

          {/* 등록 버튼 */}
          <button type="submit" className="register-button">
            등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleRegisterComponent;
