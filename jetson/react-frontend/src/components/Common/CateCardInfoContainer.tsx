import './CateCardInfoContainer.css';

interface CateCardInfoContainerProps {
  imageSrc: string;
}

export default function CateCardInfoContainer({
  imageSrc,
}: CateCardInfoContainerProps) {
  return (
    <div className="CateCardInfoContainer">
      <img src={imageSrc} alt="Category Card" className="CateCardImage" />
    </div>
  );
}
