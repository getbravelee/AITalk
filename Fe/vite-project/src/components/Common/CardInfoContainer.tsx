import './CardInfoContainer.css';

interface CardInfoContainerProps {
  imageSrc: string; // 이미지 경로를 받음
  cardName?: string; // 카드명을 받을 수 있도록 설정 (기본값은 파일명)
  className?: string; // 추가적인 클래스명 전달 가능
}

export default function CardInfoContainer({
  imageSrc,
  cardName,
  className = '',
}: CardInfoContainerProps) {
  // 이미지 경로에서 파일명 추출 (예: bread.png → bread)
  const extractedCardName =
    cardName || imageSrc.split('/').pop()?.split('.')[0] || 'Unknown';

  return (
    <div className={`CardInfoContainer ${className}`.trim()}>
      <img className="CardImage" src={imageSrc} alt={extractedCardName} />
      <p className="CardText">카드: {extractedCardName}</p>
    </div>
  );
}
