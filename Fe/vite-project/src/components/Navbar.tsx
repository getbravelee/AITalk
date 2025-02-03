import { useNavigate } from 'react-router-dom';

interface MoveBackButtonProps {
  imageSrc: string;
}

function MoveBackButton({imageSrc }: MoveBackButtonProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // 뒤로가기 기능
  };
  
  return (
    <button onClick={handleBackClick}>
      <img src={imageSrc} alt="backButton" style={{ marginRight: '8px' }} />
    </button>
  );
}

export default function Navbar() {
  return (
    <div>
      <MoveBackButton imageSrc='/src/assets/menu/back_button.png'>
      </MoveBackButton>
    </div>
  );
}
