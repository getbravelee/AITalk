import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; // 뒤로가기 화살표 아이콘

import './BackButton.css';

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <button className="BackButton" onClick={handleBack}>
      <IoArrowBack className="BackIcon" />
    </button>
  );
}

export default BackButton;
