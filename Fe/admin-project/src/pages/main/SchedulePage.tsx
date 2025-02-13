import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core'; 
import ScheduleRegisterComponent from '../../components/main/schedule/ScheduleRegisterComponent';
import '../main/SchedulePage.css'

const SchedulePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<EventInput[]>([]); 

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.date);
    setIsModalOpen(true);
  };

  const handleAddSchedule = (newEvent: EventInput) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        height="auto" 
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
