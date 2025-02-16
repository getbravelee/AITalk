import { useNavigate } from 'react-router-dom';

interface CameraButtonProps {
  scheduleId: number;
}

export default function CameraButton({ scheduleId }: CameraButtonProps) {
  const navigate = useNavigate();

  const handleClick = (): void => {
    if (!scheduleId) {
      console.error('❌ scheduleId가 없습니다.');
      return;
    }

    navigate('/camera-scan', { state: { scheduleId } });
  };

  return (
    <button onClick={handleClick}>
      <img src="/src/assets/menu/camera.png" alt="카메라 아이콘" />
      <span>사진 찍기</span>
    </button>
  );
}
