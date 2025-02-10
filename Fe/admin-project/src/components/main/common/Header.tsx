import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{ background: 'yellow', color: 'white', padding: '10px' }}>
      <nav>
        <Link to="/" style={{ margin: '0 10px' }}>
          🏠 Home
        </Link>
        <Link to="/mypage" style={{ margin: '0 10px' }}>
          📄 MyPage
        </Link>
        <Link to="/schedule" style={{ margin: '0 10px' }}>
          🗓️ Schedule
        </Link>
        <Link to="/child/list" style={{ margin: '0 10px' }}>
          👶 Child List
        </Link>
      </nav>
    </header>
  );
}
