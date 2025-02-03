import { IoArrowBack } from 'react-icons/io5'; // 뒤로가기 화살표 아이콘 (React-icons)
import '../styles/BackButton.css';

function BackButton() {
  const handleBack = () => {
    window.history.back(); // 뒤로가기 기능
  };

  return (
    <button className="BackButton" onClick={handleBack}>
      <IoArrowBack className="BackIcon" /> {/* 아이콘 */}
    </button>
  );
}

export default BackButton;
