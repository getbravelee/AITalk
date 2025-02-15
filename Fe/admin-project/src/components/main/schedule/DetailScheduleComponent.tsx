import { EventInput } from '@fullcalendar/core';
import { format, parseISO, isValid } from 'date-fns'; // ✅ 날짜 유효성 검증 추가

interface DetailScheduleProps {
  event: EventInput;
  onClose: () => void;
}

const DetailScheduleComponent = ({ event, onClose }: DetailScheduleProps) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';

    const parsedDate =
      typeof date === 'string' ? parseISO(date) : new Date(date); // ✅ ISO 문자열 처리
    return isValid(parsedDate)
      ? format(parsedDate, 'yyyy-MM-dd HH:mm')
      : '잘못된 날짜';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>📋 일정 상세 정보</h3>

        <div className="event-details">
          <p>
            <strong>제목:</strong> {event.title}
          </p>
          <p>
            <strong>날짜:</strong> {formatDate(event.start as Date | string)}
          </p>{' '}
          {/* ✅ 안전한 타입 단언 */}
          {event.end && (
            <p>
              <strong>종료 시간:</strong>{' '}
              {formatDate(event.end as Date | string)}
            </p>
          )}
          {event.description && (
            <p>
              <strong>설명:</strong> {event.description}
            </p>
          )}
        </div>

        <button className="close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default DetailScheduleComponent;
