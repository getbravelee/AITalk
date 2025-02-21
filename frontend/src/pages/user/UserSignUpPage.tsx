import React, { useState } from 'react';
import './UserSignUpPage.css';
import LogoSVG from '../../assets/User/AiTalkLogo.svg';
import { InputField } from '../../components/user/common/InputComponent';
import EmailAuthComponent from '../../components/user/common/EmailAuthComponent';
import ConfirmButton from '../../components/user/common/ConfirmButton';
import { useEmailVerify } from '../../hooks/user/useEmailAuth';
import { useEmailAuthConfirm } from '../../hooks/user/useEmailAuthConfirm';
import useSignUp from '../../hooks/user/useSignUp';

const UserSignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // 인증번호 보내줘!
  const { handleEmailVerify } = useEmailVerify();
  // 유저가 입력한 인증번호가 맞는지 확인해줘!
  const { confirmEmail } = useEmailAuthConfirm();
  const { signUp } = useSignUp();

  const handleSignup = async () => {
    const signupData = {
      name,
      id,
      password,
      confirmPassword,
      phoneNumber,
      email,
    };
    signUp(signupData);
  };

  return (
    <div className="user-signup-container">
      <div className="signup-box">
        <img src={LogoSVG} alt="logoImage" className="logo-image" />
        <h1>회원가입</h1>
        <InputField
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <InputField
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <EmailAuthComponent
          id={id}
          email={email}
          onEmailChange={(e) => setEmail(e.target.value)}
          onVerify={handleEmailVerify}
          onConfirm={confirmEmail}
          from="signUp"
        />
        <InputField
          type="text"
          placeholder="휴대폰 번호"
          value={phoneNumber}
          onChange={(e) => setPhone(e.target.value)}
        />
        <ConfirmButton onClick={handleSignup} className="signup-button">
          회원가입
        </ConfirmButton>
      </div>
    </div>
  );
};

export default UserSignupPage;
