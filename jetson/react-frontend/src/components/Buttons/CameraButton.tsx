import { useNavigate } from 'react-router-dom';

interface CameraButtonProps {
  scheduleId: number | null;
  className?: string;
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
      <img src="/images/menu/camera.png" alt="카메라 아이콘" />
      <span>사진 찍기</span>
    </button>
  );
}
