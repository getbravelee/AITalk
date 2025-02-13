import './UserLoginPage.css';
import LogoSVG from '../../assets/User/AiTalkLogo.svg';
import { useFindId } from '../../hooks/user/useFindId';
import { InputField } from '../../components/user/common/InputComponent';
import ConfirmButton from '../../components/user/common/ConfirmButton';

const UserFindIdPage: React.FC = () => {
  const { name, setName, email, setEmail, errorMessage, handleFindId } = useFindId();

  return (
    <div className="user-login-container">
      <div className="login-box">
        <img src={LogoSVG} alt="logoImage" className='logo-image'/>
        <h1>아이디 찾기</h1>
        <InputField 
          type="text" 
          placeholder="이름" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <InputField 
          type="email" 
          placeholder="이메일" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <ConfirmButton onClick={handleFindId}>찾기</ConfirmButton>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}
export default UserFindIdPage;