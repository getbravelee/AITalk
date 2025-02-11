import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  console.log('📍 현재 경로:', location.pathname); // ✅ 현재 경로 확인

  const handleLogout = () => {
    navigate('/user/login');
  };

  return (
    <header style={{ background: 'yellow', padding: '10px' }}>
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
    </header>
  );
}
