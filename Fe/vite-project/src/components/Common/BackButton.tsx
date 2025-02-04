import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

export default function Navbar() {
  
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1); // 뒤로가기 기능
  };

  return (
    <div>
      <div>
        <Button onClick={handleBackClick}>
          <img src="/src/assets/menu/back_button.png" alt="뒤로가기버튼" />
        </Button>
      </div>
    </div>
  );
}
