import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./DetailScheduleComponent.css";

interface DetailScheduleProps {
  scheduleId: string;
  onClose: () => void;
}

const DetailScheduleComponent = ({ scheduleId, onClose }: DetailScheduleProps) => {
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

  const [isEditing, setIsEditing] = useState(false); //  수정 모드 상태
  const [updatedConversation, setUpdatedConversation] = useState(""); //  대화 요약 입력 (수정 가능)

  useEffect(() => {
    fetchScheduleDetail();
  }, [scheduleId]);

  // 일정 상세 정보를 불러오는 함수
  const fetchScheduleDetail = async () => {
    try {
      const response = await axiosInstance.get(`/schedule/detail/${scheduleId}`);
      console.log("📥 상세 일정 데이터:", response.data);
      setScheduleDetail(response.data);

      //  대화 요약만 수정 가능하도록 설정
      setUpdatedConversation(response.data.conversation);
    } catch (error) {
      console.error("❌ 일정 상세 정보 불러오기 실패:", error);
    }
  };

  //  수정 버튼 클릭 시 편집 가능하도록 설정
  const handleEditClick = () => {
    setIsEditing(true);
  };

  //  수정된 데이터를 서버로 전송하는 함수
  const handleSaveClick = async () => {
    if (!scheduleDetail) return;

    const updatedPayload = {
      treatmentDate: scheduleDetail.treatmentDate,
      startTime: scheduleDetail.startTime,
      endTime: scheduleDetail.endTime,
      conversation: updatedConversation, //  대화 요약만 수정 가능
    };

    try {
      const response = await axiosInstance.put(`/schedule/detail/${scheduleId}`, updatedPayload);
      if (response.status === 200) {
        console.log(" 수정 성공:", updatedPayload);
        setIsEditing(false);
        fetchScheduleDetail(); //  수정 후 최신 데이터 다시 불러오기
      }
    } catch (error) {
      console.error("❌ 수정 요청 실패:", error);
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
              <button className="save-button" onClick={handleSaveClick}>💾 저장</button>
            ) : (
              <button className="edit-button" onClick={handleEditClick}>✏️ 수정</button>
            )}
            <button className="close-button" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="schedule-info">
          <p>📅 일시: {scheduleDetail.treatmentDate} {scheduleDetail.startTime}</p>
          <p>🏥 센터: {scheduleDetail.centerName}</p>
        </div>

        <div className="schedule-section">
          <h3>치료 내용</h3>

          {/*  단어 (수정 불가능) */}
          <p>🗣 <strong>단어:</strong></p>
          <p className="readonly">{scheduleDetail.words.join(", ")}</p>

          {/*  문장 (수정 불가능) */}
          <p>📖 <strong>문장:</strong></p>
          <p className="readonly">{scheduleDetail.sentence.join(", ")}</p>

          {/*  대화 요약 (수정 가능) */}
          <p>💬 <strong>대화 요약:</strong></p>
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
