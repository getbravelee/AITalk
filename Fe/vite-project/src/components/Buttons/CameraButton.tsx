import { useNavigate } from 'react-router-dom';

export default function CameraButton() {
  const navigate = useNavigate();

  const handleClick = (): void => {
    alert('사진 찍기로 이동합니다.');
    navigate('/camera');
  };

  return (
    <button onClick={handleClick}>
      <img src="/src/assets/menu/camera.png" alt="카메라 아이콘" />
      <span>사진 찍기</span>
    </button>
  );
}
