import { useNavigate } from 'react-router-dom';

export default function CameraButton() {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('/camera-scan');
  };

  return (
    <button onClick={handleClick}>
      <img src="/src/assets/menu/camera.png" alt="카메라 아이콘" />
      <span>사진 찍기</span>
    </button>
  );
}
