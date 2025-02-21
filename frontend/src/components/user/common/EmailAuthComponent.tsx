import React from 'react';
import ConfirmButton from './ConfirmButton';
import Modal from '../../../components/common/Modal';
import { useState } from 'react';
import { InputField } from '../../../components/user/common/InputComponent';
import './EmailAuthComponent.css';
import { useNavigate } from 'react-router-dom';

interface EmailAuthComponentProps {
  id: string
  email: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: (from: string, email: string, id: string) => void;
  onConfirm: (from: string, email: string, code: string,  id: string) => Promise<any>;
  loading?: boolean;
  error?: string;
  from: string;
}

const EmailAuthComponent: React.FC<EmailAuthComponentProps> = ({
  id,
  email,
  onEmailChange,
  onVerify,
  onConfirm,
  loading = false,
  error,
  from,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [verifyCode, setverifyCode] = useState('');
  const navigate = useNavigate();
  // 이메일 형식 검증 함수
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  // 인증 버튼 클릭 시 동작하는 핸들러, 이메일 값 검증 후 동작합니다.
  const handleVerifyClick = () => {
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!isValidEmail(email)) {
      alert('적절한 이메일 형식을 입력해주세요.');
      return;
    }
    setModalVisible(true);
    if (from === 'signUp') {
      onVerify(from, email, id);
    }
    else {
      onVerify(from, email, id);
    }
    
  };
  // 모달 내의 버튼 클릭 시, onConfirm을 호출하고 Promise resolve 시 모달 닫기
  const handleConfirm = async () => {
    try {
      
      if (from === 'signUp') {
        await onConfirm(from, email, verifyCode, id);
        // 인증 성공 시 모달 닫기
        setModalVisible(false);
      } else {
        await onConfirm(from, email, verifyCode, id);
        navigate('/user/find-pw-reset');
      }
    } catch (error) {
      console.error('인증 실패:', error);
    }
  };
  return (
    <div className="email-verification">
      <input
        type="text"
        placeholder="이메일"
        value={email}
        onChange={onEmailChange}
      />
      <ConfirmButton
        onClick={handleVerifyClick}
        className="verify-button"
      >
        {loading ? '인증 중...' : '인증'}
      </ConfirmButton>
      <div className="modal-box">
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <h2>이메일로 인증코드가 발송 되었습니다!</h2>
          <InputField
            type="text"
            placeholder="인증코드"
            value={verifyCode}
            onChange={(e) => setverifyCode(e.target.value)}
          />
          {/* 아래 인증 버튼은 Modal 내부의 버튼임 */}
          <ConfirmButton onClick={handleConfirm}>인증</ConfirmButton>
        </Modal>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default EmailAuthComponent;
