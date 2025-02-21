import { Link } from 'react-router-dom';
import './UserLoginPage.css';
import LogoSVG from '../../assets/User/AiTalkLogo.svg';
import { useLogin } from '../../hooks/user/useLogin';
import { InputField } from '../../components/user/common/InputComponent';
import ConfirmButton from '../../components/user/common/ConfirmButton';

const UserLoginPage: React.FC = () => {
  const { id, setId, password, setPassword, errorMessage, handleLogin } = useLogin();

  return (
    <div className="user-login-container">
      <div className="login-box">
        <img src={LogoSVG} alt="logoImage" className='logo-image'/>
        <h1>로그인</h1>
        <InputField 
          type="text" 
          placeholder="아이디" 
          value={id} 
          onChange={(e) => setId(e.target.value)} 
        />
        <InputField 
          type="password" 
          placeholder="비밀번호" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <ConfirmButton onClick={handleLogin}>로그인</ConfirmButton>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="links">
          <Link to="/user/find-id">아이디 찾기</Link>
          <Link to="/user/find-pw">비밀번호 찾기</Link>
          <Link to="/user/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
export default UserLoginPage;