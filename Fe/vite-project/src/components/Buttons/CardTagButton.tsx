import { useNavigate } from 'react-router-dom';

export default function CardTagButton() {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('/nfc-tag');
  };

  return (
    <button onClick={handleClick}>
      <img src="/src/assets/menu/nfc_card.png" alt="카드 태그 아이콘" />
      <span>카드 태그</span>
    </button>
  );
}
