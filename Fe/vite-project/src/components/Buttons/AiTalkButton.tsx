import { useNavigate } from 'react-router-dom';

export default function AiTalkButton() {
  const navigate = useNavigate();

  const handleClick = (): void => {
    alert('톡톡이와 이야기 하기로 이동합니다.');
    navigate('/ai-talk');
  };

  return (
    <button onClick={handleClick}>
      <img src="/src/assets/menu/symbol.png" alt="톡톡이 아이콘" />
      <span>톡톡이와 이야기 하기</span>
    </button>
  );
}
