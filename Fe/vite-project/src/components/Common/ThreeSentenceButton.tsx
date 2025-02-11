import { useNavigate } from 'react-router-dom';
import './ThreeSentenceButton.css';

export default function ThreeSentenceButton() {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('/card-play-select/three-sentence');
  };

  return (
    <button className="ThreeSentenceButton" onClick={handleClick}>
      <span>3어문</span>
    </button>
  );
}
