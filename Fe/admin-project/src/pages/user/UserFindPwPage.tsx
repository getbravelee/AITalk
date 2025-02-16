import './UserSignUpPage.css';
import LogoSVG from '../../assets/User/AiTalkLogo.svg';
import { useFindPw } from '../../hooks/user/useFindPw';
import { InputField } from '../../components/user/common/InputComponent';
import EmailAuthComponent from '../../components/user/common/EmailAuthComponent';
import { useEmailVerify } from '../../hooks/user/useEmailAuth';
import { useEmailAuthConfirm } from '../../hooks/user/useEmailAuthConfirm';

const UserFindPwPage: React.FC = () => {
  const {
    name,
    setName,
    id,
    setId,
    email,
    setEmail,
    errorMessage,
  } = useFindPw();
  const { handleEmailVerify } = useEmailVerify();
  const { confirmEmail } = useEmailAuthConfirm();

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
          id={id}
          email={email}
          onEmailChange={(e) => setEmail(e.target.value)}
          onVerify={handleEmailVerify}
          onConfirm={confirmEmail}
          from='findPw'
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};
export default UserFindPwPage;
