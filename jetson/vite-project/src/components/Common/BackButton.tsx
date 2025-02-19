import { useNavigate, useLocation } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; // 뒤로가기 화살표 아이콘
import './BackButton.css';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation(); // 📍 현재 위치 정보 가져오기

  const handleBack = () => {
    if (location.pathname === '/KidSelectPage') {
      navigate('/KidFaceLoginPage');
    } else {
      navigate('/'); // ✅ 다른 경우 기본적으로 -1로 이동
    }
  };

  return (
    <button onClick={handleBack} className="BackButton">
      <IoArrowBack className="BackIcon" />
    </button>
  );
}
