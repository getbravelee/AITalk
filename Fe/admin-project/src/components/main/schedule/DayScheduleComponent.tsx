import './DayScheduleComponent.css';

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
  console.log('🖥️ DayScheduleComponent 렌더링됨, 날짜:', date);
  console.log('📅 받은 일정 데이터:', events);

  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{formattedDate} 일정 목록</h2> {/* ✅ 한글 날짜 적용 */}
          <div className="modal-buttons">
            <button className="add-button">＋</button>
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {events.length > 0 ? (
          <ul className="event-list">
            {events.map((event) => (
              <li key={event.id} className="event-item">
                <span className="event-time">
                  {event.startTime} - {event.endTime}
                </span>
                <strong className="child-name"> {event.childName}</strong>
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
