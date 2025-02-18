// schedulepage.tsx
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import axiosInstance from '../../utils/axiosInstance';
import DayScheduleComponent from '../../components/main/schedule/DayScheduleComponent';
import './SchedulePage.css';

const eventColors = ['#f8cacc', '#6ec9e0', '#fe7f9c'];

const SchedulePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<
    {
      id: string;
      title: string;
      startTime: string;
      endTime: string;
      childName: string;
    }[]
  >([]);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // `YYYY-MM-DD` 형식으로 변환하는 함수 추가
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .format(date)
      .replace(/. /g, '-')
      .replace('.', '');
  };

  const fetchEvents = async (year: number, month: number) => {
    console.log('📡 GET 요청 보냄: /schedule/list/' + year + '/' + month);

    try {
      const response = await axiosInstance.get(
        `/schedule/list/${year}/${month}`,
      );
      console.log('📥 API 응답:', response.data);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      const formattedEvents: EventInput[] = response.data.map((item: any) => ({
        id: item.treatmentId.toString(), // ✅ ID를 문자열로 변환
        title: `${item.childName} 치료`,
        childName: item.childName,
        start: `${item.treatmentDate}T${item.startTime}`,
        end: `${item.treatmentDate}T${item.endTime}`,
      }));

      console.log('📅 캘린더에 적용할 데이터:', formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error('❌ API 호출 실패:', error);
    }
  };

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // ✅ 0-based 문제 해결
    fetchEvents(year, month);
  }, [currentDate]);

  // ✅ 변경된 달을 감지하고 `currentDate` 업데이트
  const handleDateChange = (arg: any) => {
    const newDate = new Date(arg.view.currentStart);
    console.log('📆 변경된 달:', newDate); // ✅ 디버깅용 로그 추가
    setCurrentDate(newDate);
  };

  const handleDayClick = async (arg: any) => {
    const clickedDate = new Date(arg.date);
    setSelectedDate(clickedDate);
    setIsModalOpen(true);

    setDayEvents([]); // ✅ 초기화

    const formattedDate = formatDate(clickedDate);
    console.log('📡 날짜별 GET 요청 보냄:', `/schedule/list/${formattedDate}`);

    try {
      const response = await axiosInstance.get(
        `/schedule/list/${formattedDate}`,
      );
      console.log('📥 개별 날짜 API 응답:', response.data);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      const sortedEvents = response.data
        .map((item: any) => ({
          id: item.treatmentId.toString(), // ✅ ID를 문자열로 변환
          title: item.childName, // ✅ title 추가
          childName: item.childName,
          startTime: item.startTime,
          endTime: item.endTime,
        }))
        .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));

      setDayEvents(sortedEvents);
    } catch (error) {
      console.error('❌ 개별 날짜 API 호출 실패:', error);
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale="ko"
        dateClick={handleDayClick}
        datesSet={handleDateChange}
        height="auto"
        dayMaxEvents={3}
        eventDidMount={(info) => {
          const eventIndex = parseInt(info.event.id, 10) % 3;
          info.el.style.backgroundColor = eventColors[eventIndex];
        }}
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

export default SchedulePage;
