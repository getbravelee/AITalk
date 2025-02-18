import { useNavigate } from 'react-router-dom';
import './ThreeSentenceButton.css';

interface ThreeSentenceButtonProps {
  targetPath: string;
  className?: string; // ✅ className을 받을 수 있도록 추가
}

export default function ThreeSentenceButton({
  targetPath,
  className = '',
}: ThreeSentenceButtonProps) {
  const navigate = useNavigate();

  const handleClick = (): void => {
    console.log(`🔄 Navigating to ${targetPath}...`);
    navigate(targetPath);
  };

  return (
    <button
      className={`ThreeSentenceButton ${className}`}
      onClick={handleClick}
    >
      <span>3어문</span>
    </button>
  );
}
