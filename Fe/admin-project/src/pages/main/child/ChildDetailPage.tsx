import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./ChildDetailPage.css";
import DetailChildContainer from "../../../components/main/child/DetailCardContainer";
import ChildScheduleList from "../../../components/main/child/ChildScheduleList";
import DetailScheduleComponent from "../../../components/main/schedule/DetailScheduleComponent";

export default function ChildDetailPage() {
  const { state } = useLocation();
  const [treatments, setTreatments] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null); // ✅ 선택된 일정 ID

  if (!state) {
    return <p>유효한 아동 정보가 없습니다.</p>;
  }

  const { id, childName, age, disabilityType, center } = state;

  // ✅ 치료 기록 가져오기
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await axiosInstance.get(`/child/${id}/schedule-list`);
        console.log("📥 치료 일정 데이터:", response.data);
        setTreatments(response.data);
      } catch (error) {
        console.error("❌ 치료 일정 API 호출 실패:", error);
      }
    };

    fetchTreatments();
  }, [id]);

  return (
    <div className="child-detail-container">
      <DetailChildContainer
        childName={childName}
        age={age}
        disabilityType={disabilityType}
        center={center}
      />
      <ChildScheduleList treatments={treatments} onScheduleSelect={(scheduleId) => {
        console.log("📌 클릭된 일정 ID:", scheduleId);
        if (scheduleId) {
          setSelectedScheduleId(scheduleId);
        } else {
          console.error("❌ 올바른 scheduleId가 전달되지 않음.");
        }
      }} />

      {/* ✅ 일정 선택 시 모달 띄우기 */}
      {selectedScheduleId && (
        <DetailScheduleComponent
          scheduleId={selectedScheduleId}
          onClose={() => setSelectedScheduleId(null)}
        />
      )}
    </div>
  );
}
