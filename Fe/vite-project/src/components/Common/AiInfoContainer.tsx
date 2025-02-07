import './AiInfoContainer.css';

interface AiInfoContainerProps {
  aiText?: string; // AI 관련 텍스트 (기본값은 "AI 정보 없음")
}

export default function AiInfoContainer({
  aiText = '안녕 ! 난 톡톡이야', // 기본값 설정
}: AiInfoContainerProps) {
  return (
    <div className="AiInfoContainer">
      <p className="AiText">{aiText}</p>
      <img className="AiImage" src="/src/assets/menu/symbol.png" alt={aiText} />
    </div>
  );
}
