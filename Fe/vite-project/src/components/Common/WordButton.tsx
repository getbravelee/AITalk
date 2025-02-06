import { useNavigate } from 'react-router-dom';
import './WordButton.css'; // CSS 파일 가져오기

export default function WordButton() {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('/card-play-select/word');
  };

  return (
    <button className="WordButton" onClick={handleClick}>
      <span>단어</span>
    </button>
  );
}
