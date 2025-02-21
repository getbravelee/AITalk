import './AiInfoContainer.css';
interface AiInfoContainerProps {
  aiText?: string; // AI 관련 텍스트 (기본값은 "AI 정보 없음")
  isTalking?: boolean; // 🔥 말하는 중 여부
}

export default function AiInfoContainer({
  aiText = '안녕 ! 난 톡톡이야', // 기본값 설정
  isTalking = false, // 기본값 false
}: AiInfoContainerProps) {
  return (
    <div className="AiInfoContainer">
      <p className="AiText">{aiText}</p>
      <img
        className={`AiImage ${isTalking ? 'talking' : ''}`} // 🔥 말할 때 'talking' 클래스 추가
        src="/images/menu/symbol.png"
        alt={aiText}
      />
    </div>
  );
}
