import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./HomePage.css";
import therapistImage from "../../assets/images/main/speech_therapist.png"; // ✅ 이미지 추가

interface Schedule {
  treatmentId: string;
  childName: string;
  startTime: string;
  endTime: string;
  centerName?: string; // ✅ optional 추가 (센터 정보가 없을 수도 있음)
}

export default function HomePage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);

  // ✅ 현재 시간 실시간 업데이트 (1초마다 실행)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ✅ 오늘 일정 불러오기 (API 요청)
  useEffect(() => {
    const today = formatDate(new Date()); // 🚀 현재 날짜만 사용
    const fetchTodaySchedules = async () => {
      try {
        const response = await axiosInstance.get(`/schedule/list/${today}`);
        console.log("📥 오늘의 일정 데이터:", response.data);
  
        if (Array.isArray(response.data)) {
          setTodaySchedules(response.data);
        } else {
          console.error("❌ 잘못된 일정 데이터 형식:", response.data);
          setTodaySchedules([]);
        }
      } catch (error) {
        console.error("❌ 오늘의 일정 불러오기 실패:", error);
      }
    };
  
    fetchTodaySchedules();
  
    // 🚀 하루가 바뀌는 순간 다시 요청 보내기
    const now = new Date();
    const millisUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime() - now.getTime();
  
    const timeout = setTimeout(() => {
      fetchTodaySchedules();
    }, millisUntilMidnight);
  
    return () => clearTimeout(timeout);
  }, []); // ✅ 빈 배열로 설정하여 하루에 한 번만 실행

  // ✅ 오늘 날짜 포맷 (예: 2025. 02. 16 Sunday)
  const formattedDate = currentTime.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  });

  return (
    <div className="home-container">
      {/* 왼쪽 - 오늘의 일정 */}
      <div className="today-schedule">
        <h2>{formattedDate}</h2>
        <h3>오늘의 일정 <span className="refresh-icon">🔄</span></h3>

        {todaySchedules.length > 0 ? (
          <ul className="schedule-list">
            {todaySchedules.map((schedule) => (
              <li key={schedule.treatmentId} className="schedule-item">
                <span className="time">{schedule.startTime}</span> {/* ✅ startTime만 표시 */}
                <span className="child">{schedule.childName} 치료</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-schedule">오늘 일정이 없습니다.</p>
        )}
      </div>

      {/* ✅ 구분선 */}
      <div className="divider"></div>

      {/* 오른쪽 - 메인 이미지 및 버튼 */}
      <div className="image-section">
        <div className="image-overlay">
          <img src={therapistImage} alt="Speech Therapist" className="therapist-image" />
          <div className="overlay-text">
            <h1>언어 치료를<br />보다 쉽게 돕습니다.</h1>
            <h2>AI Talk.</h2>
            <button className="check-schedule-btn" onClick={() => navigate("/main/schedule")}>
              스케줄 확인하러 가기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
