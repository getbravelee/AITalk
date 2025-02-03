import '../styles/Title.css';
import { useNavigate } from 'react-router-dom';

export default function Title() {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('MenuPage');
  };
  return (
    <div className="title">
      <h1 onClick={handleClick}>아이톡</h1>
      <h1>(Ai Talk)</h1>
      <p>놀이로 배우는 재밌는 언어치료</p>
    </div>
  );
}