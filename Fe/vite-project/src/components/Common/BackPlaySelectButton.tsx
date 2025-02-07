import { useNavigate } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5'; // 🏠 홈 아이콘 추가

import './BackPlaySelectButton.css';

export default function BackPlaySelectButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/play-select'); // PlaySelectPage로 이동
  };

  return (
    <button className="BackPlaySelectButton" onClick={handleBack}>
      <IoHomeOutline className="BackPlaySelectIcon" /> {/* 🏠 홈 아이콘 추가 */}
    </button>
  );
}
