import React, { useState } from 'react';
import './UserSignupPage.css';
import LogoSVG from '../../assets/User/AiTalkLogo.svg';

const UserSignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = () => {
    // 회원가입 로직 처리
    console.log({
      name,
      id,
      password,
      confirmPassword,
      phone,
      email,
    });
  };

  return (
    <div className="user-signup-container">
      <div className="signup-box">
        <img src={LogoSVG} alt="logoImage" className="logo-image" />
        <h1>회원가입</h1>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="email-verification">
          <input
            type="text"
            placeholder="이메일 인증"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="verify-button">인증</button>
        </div>
        <input
          type="text"
          placeholder="휴대폰 번호"
          value={phone}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="signup-button" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default UserSignupPage;
