import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../../../assets/images/main/logo.png';

const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/main/mypage'); // 마이페이지로 이동
  };

  return (
    <header className="header-container">
      <nav className="nav-bar">
       
        <Link to="/main/home" className="logo-container">
          <img src={logo} alt="AiTalk 로고" className="logo" />
        </Link>
        <Link to="/main/schedule" className="nav-item">
          예약 관리
        </Link>
        <Link to="/main/child/list" className="nav-item">
          치료 아동 관리
        </Link>
        
        <div className="profile-section" onClick={handleProfileClick}>
          <span>치료사님 안녕하세요!</span>
          <FaUserCircle className="profile-icon" />
        </div>
      </nav>

      {/* ✅ 헤더 아래에 전체 너비를 차지하는 라인 추가 */}
      <hr className="header-line" />
    </header>
  );
};

export default Header;
