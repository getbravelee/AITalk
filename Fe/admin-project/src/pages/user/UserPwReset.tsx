import './UserSignUpPage.css';
import LogoSVG from '../../assets/User/AiTalkLogo.svg';
import { useResetPw } from '../../hooks/user/useResetPw';
import { InputField } from '../../components/user/common/InputComponent';
import ConfirmButton from '../../components/user/common/ConfirmButton';

const UserFindPwPage: React.FC = () => {
  const {
    id,
    setId,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errorMessage,
    handleResetPw,
  } = useResetPw();

  return (
    <div className="user-signup-container">
      <div className="signup-box">
        <img src={LogoSVG} alt="logoImage" className="logo-image" />
        <h1>비밀번호 재설정</h1>
        <InputField
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <InputField
          type="text"
          placeholder="새로운 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='email-verification'>
          <InputField
            type="text"
            placeholder="새로운 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <ConfirmButton onClick={handleResetPw} className='signup-button'>확인</ConfirmButton>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};
export default UserFindPwPage;
