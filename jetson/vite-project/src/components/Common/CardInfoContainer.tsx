import './CardInfoContainer.css';

interface CardInfoContainerProps {
  imageSrc: string; // 이미지 경로를 받음
  cardName?: string; // 카드명을 받을 수 있도록 설정 (기본값은 파일명)
  className?: string; // 추가적인 클래스명 전달 가능
}

export default function CardInfoContainer({
  imageSrc,
  cardName, // name 값이 여기에 들어옴
  className = '',
}: CardInfoContainerProps) {
  // cardName이 있으면 사용, 없으면 이미지 파일명에서 추출
  const displayCardName =
    cardName || imageSrc.split('/').pop()?.split('.')[0] || 'Unknown';

  return (
    <div className={`CardInfoContainer ${className}`.trim()}>
      <img className="CardImage" src={imageSrc} alt={displayCardName} />
      <p className="CardTexts">{displayCardName}</p>
    </div>
  );
}
