import { Link, useNavigate } from 'react-router-dom';
import './UserLoginPage.css';
import LogoSVG from '../../assets/User/AiTalkLogo.svg';


export default function UserLoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 🎈 이 곳에 로그인 로직이 들어갑니다. 
    navigate('/main/home');
  };

  return (
    <div className="user-login-container">
      <div className="login-box">
        <img src={LogoSVG} alt="logoImage" className='logo-image'/>
        <h1>로그인</h1>
        <input type="text" placeholder="아이디" />
        <input type="password" placeholder="비밀번호" />
        <button onClick={handleLogin}>로그인</button>
        <div className="links">
          <Link to="/user/find-id">아이디 찾기</Link>
          <Link to="/user/find-pw">비밀번호 찾기</Link>
          <Link to="/user/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
