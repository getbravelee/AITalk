import { useNavigate } from 'react-router-dom';

interface CameraButtonProps {
  scheduleId: number;
  className?: string; // 👈 className을 props로 받을 수 있도록 추가
}

export default function CameraButton({
  scheduleId,
  className,
}: CameraButtonProps) {
  const navigate = useNavigate();

  const handleClick = (): void => {
    if (!scheduleId) {
      console.error('❌ scheduleId가 없습니다.');
      return;
    }

    navigate('/camera-scan', { state: { scheduleId } });
  };

  return (
    <button className={`CameraButton ${className || ''}`} onClick={handleClick}>
      <img src="/src/assets/menu/camera.png" alt="카메라 아이콘" />
      <span>사진 찍기</span>
    </button>
  );
}
