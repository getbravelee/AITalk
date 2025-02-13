import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExited?: () => void;
  children: React.ReactNode;
  animationDuration?: number; // 애니메이션 지속 시간 (ms)
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onExited,
  children,
  animationDuration = 300,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  // 모달의 실제 렌더링 상태: 애니메이션 효과 때문에 isOpen이 false여도 잠시 유지됨.
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      // isOpen이 false가 되면 애니메이션에 맞춘 delay 후에 visible 상태를 false로 설정
      const timer = setTimeout(() => {
        setVisible(false);
        // 애니메이션 종료 후 onExited 콜백 호출 (있다면)
        if (onExited) onExited();
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration, onExited]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        // isOpen이 false일 때 opacity를 0으로 변경하여 fade-out 효과 적용
        opacity: isOpen ? 1 : 0,
        transition: `opacity ${animationDuration}ms ease-in-out`,
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          position: 'relative',
          minWidth: '300px',
          maxWidth: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {/* 모달 오른쪽 상단에 close 버튼 추가 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '5px',
            right: '1px',
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            lineHeight: '1',
            color: 'black'
          }}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
