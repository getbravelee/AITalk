import './ImgGenerateText.css';

interface ImgGenerateTextProps {
  className?: string; // className을 받을 수 있도록 설정
}

export default function ImgGenerateText({
  className = '',
}: ImgGenerateTextProps) {
  return (
    <div className={`ImgGenerateTextContainer ${className}`.trim()}>
      <p className="ImgGenerateText">🪄 톡톡이가 그림을 만들고 있어요 !</p>
    </div>
  );
}
