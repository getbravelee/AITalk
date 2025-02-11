import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();


  const handleLogout = () => {
    navigate('/user/login');
  };

  return (
    <header style={{ background: 'yellow', padding: '20px' }}>
      <nav>
        <Link to="/main/home" style={{ margin: '0 10px' }}>
          🏠 Home
        </Link>
        <Link to="/main/mypage" style={{ margin: '0 10px' }}>
          📄 MyPage
        </Link>
        <Link to="/main/schedule" style={{ margin: '0 10px' }}>
          🗓️ Schedule
        </Link>
        <Link to="/main/child/list" style={{ margin: '0 10px' }}>
          👶 Child List
        </Link>

        <button type="button" onClick={handleLogout}>
          🚪 로그아웃
        </button>
      </nav>
      <hr />
    </header> 
  );
}
