import './UserLoginPage.css';
import LogoSVG from '../../assets/User/AiTalkLogo.svg';
import { useFindId } from '../../hooks/user/useFindId';
import { InputField } from '../../components/user/common/InputComponent';
import ConfirmButton from '../../components/user/common/ConfirmButton';
import Modal from '../../components/common/Modal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserFindIdPage: React.FC = () => {
  const navigate = useNavigate();
  const { name, setName, email, setEmail, errorMessage, handleFindId } =
    useFindId();
  const [modalVisible, setModalVisible] = useState(false);

  const handleButtonClick = async () => {
    // 이름과 이메일이 입력되었는지 확인합니다.
    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    // 이메일 형식 검증 (영문 대소문자, 숫자, 일부 특수문자 포함)
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      alert('적절한 이메일 형식을 입력해주세요.');
      return;
    }

    setModalVisible(true); // 모달 열기
    await handleFindId(); // ID 찾기 작업이 완료될 때까지 대기
  };

  const handleModalClose = () => {
    setModalVisible(false); // 모달 닫기
    navigate('/user/login'); // 모달이 닫히자마자 즉시 로그인 페이지로 이동
  };

  return (
    <div className="user-login-container">
      <div className="login-box">
        <img src={LogoSVG} alt="logoImage" className="logo-image" />
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
        <ConfirmButton onClick={handleButtonClick}>찾기</ConfirmButton>
        <Modal isOpen={modalVisible} onClose={handleModalClose}>
          <h2>이메일이 발송 되었습니다!</h2>
          <button onClick={handleModalClose}>닫기</button>
        </Modal>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default UserFindIdPage;
