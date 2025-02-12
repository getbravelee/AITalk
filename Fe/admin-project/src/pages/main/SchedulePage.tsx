import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core'; // ✅ FullCalendar의 EventInput 사용
import ScheduleRegisterComponent from '../../components/main/schedule/ScheduleRegisterComponent';

const SchedulePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<EventInput[]>([]); // ✅ EventInput 사용

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.date);
    setIsModalOpen(true);
  };

  const handleAddSchedule = (newEvent: EventInput) => {
    // ✅ EventInput 타입 그대로 사용
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
      />

      {isModalOpen && selectedDate && (
        <ScheduleRegisterComponent
          date={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onAddSchedule={handleAddSchedule}
        />
      )}
    </div>
  );
};

export default SchedulePage;
