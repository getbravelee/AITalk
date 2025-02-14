import { useEffect, useState } from 'react';
import './DayScheduleComponent.css';

interface DayScheduleProps {
  date: Date;
  events: { id: string; title: string; startTime: string }[];
  onClose: () => void;
}

const DayScheduleComponent = ({ date, events, onClose }: DayScheduleProps) => {
  console.log("🖥️ DayScheduleComponent 렌더링됨, 날짜:", date);
  console.log("📅 받은 일정 데이터:", events);
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{date.toDateString()} 일정 목록</h2>
          <div className="modal-buttons">
            <button className="add-button">＋</button>
            <button className="close-button" onClick={onClose}>✕</button>
          </div>
        </div>

        {events.length > 0 ? (
          <ul className="event-list">
            {events.map((event) => (
              <li key={event.id} className="event-item">
                <span className="event-time">{event.startTime}</span> - {event.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-events">일정이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default DayScheduleComponent;
