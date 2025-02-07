import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; // 뒤로가기 화살표 아이콘

import './BackButton.css';

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
<<<<<<< HEAD
    navigate(-1); // 이전 페이지로 이동
=======
    navigate(-1); // 📌 브라우저의 뒤로가기 기능과 동일하게 수정
>>>>>>> develop
  };

  return (
    <button className="BackButton" onClick={handleBack}>
      <IoArrowBack className="BackIcon" />
    </button>
  );
}

export default BackButton;
