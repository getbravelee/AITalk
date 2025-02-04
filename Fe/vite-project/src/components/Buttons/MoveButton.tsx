import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface MoveButtonProps {
  message: string;
  children: ReactNode;
  page: string
}

export default function MoveButton({ message, children, page }: MoveButtonProps) {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate(page);
  };
  return (
    <button onClick={() => {
      alert(message)
      handleClick()
      }}>
      {children}
    </button>
  );
}