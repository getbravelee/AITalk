import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import axiosInstance from '../../utils/axiosInstance';
import DayScheduleComponent from '../../components/main/schedule/DayScheduleComponent';
import './SchedulePage.css';




const SchedulePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [dayEvents, setDayEvents] = useState<{ id: string; title: string; startTime: string; endTime: string }[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date()); 



  const fetchEvents = async (year: number, month: number) => {
    console.log("📡 GET 요청 보냄: /schedule/list/" + year + "/" + month);

    try {
      const response = await axiosInstance.get(`/schedule/list/${year}/${month}`);
      console.log("📥 API 응답:", response.data);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }

      const formattedEvents: EventInput[] = response.data.map((item: any) => ({
        id: item.treatmentId,
        title: `${item.childName} 치료`,
        start: `${item.treatmentDate}T${item.startTime}`,
        end: `${item.treatmentDate}T${item.endTime}`,
      }));

      console.log("📅 캘린더에 적용할 데이터:", formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error("❌ API 호출 실패:", error);
    }
  };

  // 📌 캘린더의 월이 변경될 때 실행되는 함수
  const handleDateChange = (arg: any) => {
    const newDate = new Date(arg.view.currentStart); // ✅ 변경된 달의 첫 날
    setCurrentDate(newDate); // ✅ 현재 보고 있는 날짜 업데이트
  };

  // 📌 현재 보고 있는 연/월이 변경될 때마다 API 호출
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    fetchEvents(year, month);
  }, [currentDate]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date).replace(/. /g, '-').replace('.', '');
  };


  const handleDayClick = async (arg: any) => {
    const clickedDate = new Date(arg.date);
    setSelectedDate(clickedDate);
    setIsModalOpen(true);
    setDayEvents([]);
  

    // ✅ YYYY-MM-DD 형식 변환 (UTC 영향 없음)
    const formattedDate = formatDate(clickedDate);
    console.log("📡 날짜별 GET 요청 보냄:", `/schedule/list/${formattedDate}`);
  
    try {
      const response = await axiosInstance.get(`/schedule/list/${formattedDate}`);
      console.log("📥 개별 날짜 API 응답:", response.data);
  
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }
  
      const sortedEvents = response.data
        .map((item: any) => ({
          id: item.treatmentId,
          title: `${item.childName} 치료`,
          startTime: item.startTime,
          endTime: item.endTime,
        }))
        .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));
  
      setDayEvents(sortedEvents);
    } catch (error) {
      console.error("❌ 개별 날짜 API 호출 실패:", error);
    }

  const handleAddSchedule = (newEvent: EventInput) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);

  };
  

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDayClick} 
        datesSet={handleDateChange} // ✅ 달이 변경될 때 실행됨
        dayMaxEvents={3}
        fixedWeekCount={false}
        height="auto"

      />


      {isModalOpen && selectedDate && (
        <DayScheduleComponent
          date={selectedDate}
          events={dayEvents}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
};

export default SchedulePage;
