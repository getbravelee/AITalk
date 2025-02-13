import React from 'react';
import ConfirmButton from './ConfirmButton';
import Modal from '../../../components/common/Modal';
import { useState } from 'react';
import { InputField } from '../../../components/user/common/InputComponent';
import './EmailAuthComponent.css';

interface EmailAuthComponentProps {
  email: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: (email: string) => void;
  loading?: boolean;
  error?: string;
}

const EmailAuthComponent: React.FC<EmailAuthComponentProps> = ({
  email,
  onEmailChange,
  onVerify,
  loading = false,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [verifyNumber, setverifyNumber] = useState('');
  return (
    <div className="email-verification">
      <input
        type="text"
        placeholder="이메일"
        value={email}
        onChange={onEmailChange}
      />
      <ConfirmButton
        onClick={() => {
          setModalVisible(true);
          // 이 아래에 이메일 인증 코드를 전송해 달라는 api 요청 로직이 들어갑니다.
          onVerify(email);
        }}
        className="verify-button"
      >
        {loading ? '인증 중...' : '인증'}
      </ConfirmButton>
      <div className='modal-box'>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <h2>이메일이 발송 되었습니다!</h2>
          <InputField
            type="text"
            placeholder="인증번호"
            value={verifyNumber}
            onChange={(e) => setverifyNumber(e.target.value)}
          />
          <ConfirmButton>인증</ConfirmButton>
        </Modal>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default EmailAuthComponent;
