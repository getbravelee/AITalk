import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface playButtonProps {
  message: string;
  children: ReactNode;
  imageSrc: string;
}

function PlayButton({ message, children, imageSrc }: playButtonProps) {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('DetailSelectPage');
  };
  return (
    <button onClick={() => {
      alert(message)
      handleClick()
      }}>
      <img src={imageSrc} alt="menu icon" style={{ marginRight: '8px' }} />
      {children}
    </button>
  );
}

export default function Menu() {
  return (
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
  );
}
