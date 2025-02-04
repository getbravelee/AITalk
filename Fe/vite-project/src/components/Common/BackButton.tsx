import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; // 뒤로가기 화살표 아이콘
import '../../styles/BackButton.css';

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/test'); // 📌 'localhost:5173/test' 경로로 이동 (TestPage로 고정)
  };

  return (
    <button className="BackButton" onClick={handleBack}>
      <IoArrowBack className="BackIcon" />
    </button>
  );
}

export default BackButton;
