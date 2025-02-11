import { useNavigate } from 'react-router-dom';
import './ThreeSentenceButton.css';

interface ThreeSentenceButtonProps {
  targetPath: string; // 경로를 설정하는 prop
}

export default function ThreeSentenceButton({
  targetPath,
}: ThreeSentenceButtonProps) {
  const navigate = useNavigate();

  const handleClick = (): void => {
    console.log(`🔄 Navigating to ${targetPath}...`);
    navigate(targetPath);
  };

  return (
    <button className="ThreeSentenceButton" onClick={handleClick}>
      <span>3어문</span>
    </button>
  );
}
