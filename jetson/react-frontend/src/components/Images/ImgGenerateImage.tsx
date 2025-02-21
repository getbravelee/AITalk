import { useNavigate } from 'react-router-dom';
import './ImgGenerateImage.css';

interface ImgGenerateImageProps {
  className?: string; // className을 받을 수 있도록 설정
}

export default function ImgGenerateImage({
  className = '',
}: ImgGenerateImageProps) {
  const navigate = useNavigate();

  return (
    <div className={`ImgGenerateImageContainer ${className}`.trim()}>
      <img
        src="/images/menu/symbol.png"
        alt="이미지 생성 중 캐릭터 이미지"
        className="ImgGenerateImage"
        onClick={() => navigate('/camera-play-select')}
      />
    </div>
  );
}
