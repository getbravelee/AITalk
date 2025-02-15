import { useNavigate, useLocation } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5'; // 🏠 홈 아이콘

import './BackPlaySelectButton.css';

export default function BackPlaySelectButton() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 현재 페이지 경로 확인

  const handleBack = async () => {
    try {
      console.log('📡 Back 버튼 클릭됨! 현재 경로:', location.pathname);

      // ✅ "/ai-talk" 페이지에서만 API 호출
      if (location.pathname === '/ai-talk') {
        console.log('📡 대화 종료 API 요청 보내는 중...');

        const response = await fetch('http://127.0.0.1:5000/play/talk-stop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ childId: 10001 }), // 필요한 경우 childId 변경 가능
        });

        if (!response.ok) {
          throw new Error(`대화 종료 실패 (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log('✅ 대화 종료 응답:', data);
      } else {
        console.log(
          '🔕 대화 종료 API 호출 안 함 (현재 페이지:',
          location.pathname,
          ')',
        );
      }

      // 🎯 PlaySelectPage로 이동
      navigate('/play-select');
    } catch (error) {
      console.error('❌ 대화 종료 중 오류 발생:', error);
    }
  };

  return (
    <button className="BackPlaySelectButton" onClick={handleBack}>
      <IoHomeOutline className="BackPlaySelectIcon" /> {/* 🏠 홈 아이콘 추가 */}
    </button>
  );
}
