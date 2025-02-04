import NavbarContainer from '../components/Common/NavbarContainer';
import './CardPlaySelectPage.css';
import BackButton from '../components/Common/BackButton';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CardPlaySelectPage() {
  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectContainer">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <PlayButton
            message="카드 태그로 이동합니다."
            imageSrc="/src/assets/menu/nfc_card.png"
          >
            카드 태그
          </PlayButton>
          <PlayButton
            message="사진 찍기로 이동합니다."
            imageSrc="/src/assets/menu/camera.png"
          >
            사진 찍기
          </PlayButton>
          <PlayButton
            message="톡톡이와 이야기 하기로 이동합니다."
            imageSrc="/src/assets/menu/symbol.png"
          >
            톡톡이와 이야기 하기
          </PlayButton>
        </div>
      </div>
    </div>
  );
}

interface playButtonProps {
  message: string;
  children: ReactNode;
  imageSrc: string;
}

function PlayButton({ message, children, imageSrc }: playButtonProps) {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('/nfc-tag');
  };
  return (
    <button
      onClick={() => {
        alert(message);
        handleClick();
      }}
    >
      <img src={imageSrc} alt="menu icon" style={{ marginRight: '8px' }} />
      {children}
    </button>
  );
}
