import { useNavigate } from 'react-router-dom';

import './HomeText.css';

export default function HomeText() {
  const navigate = useNavigate();
  const handleClick = (): void => {
    navigate('/play-select');
  };

  return (
    <div className="HomeTextContainer">
      <p className="Title" onClick={handleClick}>
        아이톡
      </p>
      <p className="SubTitle">(Ai Talk)</p>
      <p className="Explain">놀이로 배우는 재밌는 언어치료</p>
    </div>
  );
}
