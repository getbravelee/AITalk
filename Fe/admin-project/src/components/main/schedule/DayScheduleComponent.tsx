interface DayScheduleProps {
  date: Date;
  events: { id: string; title: string; start: string }[];
  onClose: () => void;
}

const DayScheduleComponent = ({ date, events, onClose }: DayScheduleProps) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{date.toDateString()} 일정 목록</h2>

        {events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event.id} className="event-item">
                {event.title}
              </li>
            ))}
          </ul>
        ) : (
          <p>일정이 없습니다.</p>
        )}

        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default DayScheduleComponent;
