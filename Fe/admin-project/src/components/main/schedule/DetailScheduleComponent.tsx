import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import './DetailScheduleComponent.css';

interface DetailScheduleProps {
  scheduleId: string;
  onClose: () => void;
}

const DetailScheduleComponent = ({
  scheduleId,
  onClose,
}: DetailScheduleProps) => {
  const [scheduleDetail, setScheduleDetail] = useState<{
    childName: string;
    treatmentDate: string;
    centerName: string;
    startTime: string;
    endTime: string;
    words: string[];
    sentence: string[];
    conversation: string;
  } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [updatedConversation, setUpdatedConversation] = useState('');

  useEffect(() => {
    fetchScheduleDetail();
  }, [scheduleId]);

  const fetchScheduleDetail = async () => {
    try {
      const response = await axiosInstance.get(
        `/schedule/detail/${scheduleId}`,
      );
      console.log('📥 상세 일정 데이터:', response.data);
      setScheduleDetail(response.data);
      setUpdatedConversation(response.data.conversation);
    } catch (error) {
      console.error('❌ 일정 상세 정보 불러오기 실패:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!scheduleDetail) return;

    const updatedPayload = {
      treatmentDate: scheduleDetail.treatmentDate,
      startTime: scheduleDetail.startTime,
      endTime: scheduleDetail.endTime,
      conversation: updatedConversation,
    };

    try {
      const response = await axiosInstance.put(
        `/schedule/detail/${scheduleId}`,
        updatedPayload,
      );
      if (response.status === 200) {
        console.log('✅ 수정 성공:', updatedPayload);
        setIsEditing(false);
        fetchScheduleDetail();
      }
    } catch (error) {
      console.error('❌ 수정 요청 실패:', error);
    }
  };

  if (!scheduleDetail) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>일정 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{scheduleDetail.childName}</h2>
          <div className="modal-buttons">
            {isEditing ? (
              <button className="save-button" onClick={handleSaveClick}>
                💾 저장
              </button>
            ) : (
              <button className="edit-button" onClick={handleEditClick}>
                ✏️ 수정
              </button>
            )}
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="schedule-info">
          <p>
            📅 일시: {scheduleDetail.treatmentDate} {scheduleDetail.startTime}
          </p>
          <p>🏥 센터: {scheduleDetail.centerName}</p>
        </div>

        <div className="schedule-section">
          <h3>치료 내용</h3>
          <p>
            🗣 <strong>단어:</strong>
          </p>
          <p className="readonly">{scheduleDetail.words.join(', ')}</p>

          <p>
            📖 <strong>문장:</strong>
          </p>
          <p className="readonly">{scheduleDetail.sentence.join(', ')}</p>

          <p>
            💬 <strong>대화 요약:</strong>
          </p>
          {isEditing ? (
            <textarea
              value={updatedConversation}
              onChange={(e) => setUpdatedConversation(e.target.value)}
              placeholder="대화 요약을 입력하세요..."
            />
          ) : (
            <p>{scheduleDetail.conversation}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailScheduleComponent;
