import { useState } from "react";
import "./DayScheduleComponent.css";
import DetailScheduleComponent from "./DetailScheduleComponent";
import ScheduleRegisterComponent from "./ScheduleRegisterComponent";

interface DayScheduleProps {
  date: Date;
  events: {
    id: string;
    startTime: string;
    endTime: string;
    childName: string;
  }[];
  onClose: () => void;
}

const DayScheduleComponent = ({ date, events, onClose }: DayScheduleProps) => {
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false); // 스케줄 등록 모달 상태

  const formattedDate = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{formattedDate} 일정 목록</h2>
          <div className="modal-buttons">
            {/* 일정 등록 버튼 */}
            <button className="add-button" onClick={() => setIsRegisterModalOpen(true)}>＋</button>
            {/* 닫기 버튼 (X) */}
            <button className="close-button always-visible" onClick={onClose}>✕</button>
          </div>
        </div>

        {events.length > 0 ? (
          <ul className="event-list">
            {events.map((event) => (
              <li key={event.id} className="event-item" onClick={() => setSelectedScheduleId(event.id)}>
                <span className="event-time">{event.startTime} - {event.endTime}</span>
                <strong className="child-name"> {event.childName}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-events">일정이 없습니다.</p>
        )}

        {/* 상세 일정 모달 */}
        {selectedScheduleId && (
          <DetailScheduleComponent scheduleId={selectedScheduleId} onClose={() => setSelectedScheduleId(null)} />
        )}

        {/* 스케줄 등록 모달 */}
        {isRegisterModalOpen && (
          <ScheduleRegisterComponent date={date} onClose={() => setIsRegisterModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default DayScheduleComponent;
