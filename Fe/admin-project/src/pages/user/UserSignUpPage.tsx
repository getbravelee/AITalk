import React, { useState } from 'react';
import './UserSignupPage.css';
import LogoSVG from '../../assets/User/AiTalkLogo.svg';
import { InputField } from '../../components/user/common/InputComponent';
import EmailAuthComponent from '../../components/user/common/EmailAuthComponent';
import ConfirmButton from '../../components/user/common/ConfirmButton';
import { useEmailVerify } from '../../hooks/user/useEmailAuth';

const UserSignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const { handleEmailVerify, loading, error } = useEmailVerify();

  const handleSignup = () => {
    // 회원가입 로직 처리
    console.log({
      name,
      id,
      password,
      confirmPassword,
      phoneNumber,
      email,
    });
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
          email={email}
          onEmailChange={(e) => setEmail(e.target.value)}
          onVerify={handleEmailVerify}
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
