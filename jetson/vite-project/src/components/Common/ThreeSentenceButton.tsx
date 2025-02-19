import { useNavigate } from 'react-router-dom';
import './ThreeSentenceButton.css';
import UseThreeSentence from '../../hooks/UseThreeSentence';

interface ThreeSentenceButtonProps {
  targetPath: string;
  className?: string; // ✅ className을 받을 수 있도록 추가
  schedule_id: number;
  word: string;
}

export default function ThreeSentenceButton({
  targetPath,
  className = '',
  schedule_id,
  word
}: ThreeSentenceButtonProps) {
  const { generateSentence } = UseThreeSentence() 

  const handleClick = (): void => {
    console.log(`🔄 Navigating to ${targetPath}...`);
    generateSentence(schedule_id, word)
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
