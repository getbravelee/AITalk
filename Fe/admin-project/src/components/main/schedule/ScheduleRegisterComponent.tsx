import React, { useState } from 'react';
import { EventInput } from '@fullcalendar/core';
import './ScheduleRegisterComponent.css';

interface ScheduleRegisterProps {
  date: Date;
  onClose: () => void;
  onAddSchedule: (newEvent: EventInput) => void;
}

const ScheduleRegisterComponent = ({
  date,
  onClose,
  onAddSchedule,
}: ScheduleRegisterProps) => {
  const [startTime, setStartTime] = useState('00:00');
  const [isAllDay, setIsAllDay] = useState(false);

  const handleAddSchedule = () => {
    const newEvent: EventInput = {
      id: `${Date.now()}`,
      title: isAllDay ? '종일' : startTime,
      start: `${date.toISOString().split('T')[0]}T${startTime}`,
      allDay: isAllDay,
    };

    onAddSchedule(newEvent);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>일정 추가</h3>

        <label>
          날짜:
          <input
            type="text"
            value={date.toISOString().split('T')[0]}
            readOnly
          />
        </label>

        <label>
          시작 시간:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isAllDay}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={isAllDay}
            onChange={() => setIsAllDay(!isAllDay)}
          />
          종일
        </label>

        <div className="modal-buttons">
          <button onClick={handleAddSchedule}>추가</button>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleRegisterComponent;
