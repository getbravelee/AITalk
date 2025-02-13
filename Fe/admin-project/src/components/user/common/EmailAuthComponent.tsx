import React from 'react';
import ConfirmButton from './ConfirmButton';

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
  return (
    <div className="email-verification">
      <input
        type="text"
        placeholder="이메일"
        value={email}
        onChange={onEmailChange}
      />
      <ConfirmButton
        onClick={() => onVerify(email)}
        className="verify-button"
        disabled={loading}
      >
        {loading ? '인증 중...' : '인증'}
      </ConfirmButton>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default EmailAuthComponent;
