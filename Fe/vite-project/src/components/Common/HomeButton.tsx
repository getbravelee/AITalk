
import { useNavigate } from 'react-router-dom';
import './HomeButton.css'

export default function HomeButton() {
  const homeImage = 'src/assets/common/Home.svg';
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/HomeAfterLoginPage')}
      className='HomeButton'
    >
      <img src={homeImage} alt="홈버튼" />
    </button>
  );
}
