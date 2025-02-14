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
  onConfirm: (email: string, code: string) => Promise<any>;
  loading?: boolean;
  error?: string;
}

const EmailAuthComponent: React.FC<EmailAuthComponentProps> = ({
  email,
  onEmailChange,
  onVerify,
  onConfirm,
  loading = false,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [verifyCode, setverifyCode] = useState('');
  // 모달 내의 버튼 클릭 시, onConfirm을 호출하고 Promise resolve 시 모달 닫기
  const handleConfirm = async () => {
    try {
      await onConfirm(email, verifyCode);
      // 인증 성공 시 모달 닫기
      setModalVisible(false);
    } catch (error) {
      console.error('인증 실패:', error);
      // 에러 처리 로직 추가 가능
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
        onClick={() => {
          setModalVisible(true);
          // 이 아래에 이메일 인증 코드를 전송해 달라는 api 요청 로직이 들어갑니다.
          onVerify(email);
          // 이후 유저는 이메일을 확인하고 인증 코드를 복사 후 아래 Modal의 Input 태그에 값을 입력합니다.
        }}
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
