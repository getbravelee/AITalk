import { useNavigate, useLocation } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5'; // 🏠 홈 아이콘
import { RootState } from '../../feature/store';
import { useSelector } from 'react-redux';

import './BackPlaySelectButton.css';

interface BackPlaySelectButtonProps {
  className?: string; // ✅ 추가된 className prop
}

export default function BackPlaySelectButton({
  className = '',
}: BackPlaySelectButtonProps) {
  const currentChild: string = useSelector((state: RootState) => {
    const id = state.child.currentChild?.child_id;
    return id !== undefined ? String(id) : '';
  });

  const currentScheduleId: number | null = useSelector((state: RootState) =>
    state.treatment?.treatmentId ? Number(state.treatment?.treatmentId) : null,
  );

  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = async () => {
    try {
      console.log('📡 Back 버튼 클릭됨! 현재 경로:', location.pathname);

      if (location.pathname === '/ai-talk') {
        console.log('📡 대화 종료 API 요청 보내는 중...');
        console.log(currentChild);

        const response = await fetch('http://127.0.0.1:5000/play/talk-stop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            child_id: currentChild,
            schedule_id: currentScheduleId,
          }),
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

      navigate('/play-select');
    } catch (error) {
      console.error('❌ 대화 종료 중 오류 발생:', error);
    }
  };

  return (
    <button
      className={`BackPlaySelectButton ${className}`}
      onClick={handleBack}
    >
      <IoHomeOutline className="BackPlaySelectIcon" />
    </button>
  );
}
