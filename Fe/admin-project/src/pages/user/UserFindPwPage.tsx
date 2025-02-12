import './UserSignUpPage.css';
import LogoSVG from '../../assets/User/AiTalkLogo.svg';
import { useFindPw } from '../../hooks/user/useFindPw';
import { InputField } from '../../components/user/common/InputComponent';
import ConfirmButton from '../../components/user/common/ConfirmButton';
import EmailAuthComponent from '../../components/user/common/EmailAuthComponent';
import { useEmailVerify } from '../../hooks/user/useEmailAuth';

const UserFindPwPage: React.FC = () => {

  const {
    name,
    setName,
    id,
    setId,
    email,
    setEmail,
    errorMessage,
    handleFindPw,
  } = useFindPw();

  const { handleEmailVerify, loading, error } = useEmailVerify();
  return (
    <div className="user-signup-container">
      <div className="signup-box">
        <img src={LogoSVG} alt="logoImage" className="logo-image" />
        <h1>비밀번호 찾기</h1>
        <InputField
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <EmailAuthComponent
          email={email}
          onEmailChange={(e) => setEmail(e.target.value)}
          onVerify={handleEmailVerify}
        />
        <ConfirmButton onClick={handleFindPw} className="signup-button">
          비밀번호 찾기
        </ConfirmButton>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};
export default UserFindPwPage;
