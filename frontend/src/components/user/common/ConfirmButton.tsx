import React from 'react';

interface ConfirmButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ onClick, children, className }) => {
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default ConfirmButton;
