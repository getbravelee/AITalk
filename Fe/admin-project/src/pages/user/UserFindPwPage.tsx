import './UserSignUpPage.css';
import LogoSVG from '../../assets/User/AiTalkLogo.svg';
import { useFindPw } from '../../hooks/user/useFindPw';
import { InputField } from '../../components/user/common/InputComponent';
import ConfirmButton from '../../components/user/common/ConfirmButton';
import EmailAuthComponent from '../../components/user/common/EmailAuthComponent';
import { useEmailVerify } from '../../hooks/user/useEmailAuth';
// import Modal from '../../components/common/Modal';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

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

  const [modalVisible, setModalVisible] = useState(false);

  const handleButtonClick = async () => {
    setModalVisible(true); // 모달 열기
    await handleFindId(); // ID 찾기 작업이 완료될 때까지 대기
  };

  const handleModalClose = () => {
    setModalVisible(false); // 모달 닫기
    navigate('/user/login'); // 모달이 닫히자마자 즉시 로그인 페이지로 이동
  };
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
