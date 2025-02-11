import { useNavigate } from 'react-router-dom';
import './NfcImage.css';

interface NfcImageProps {
  className?: string; // className을 받을 수 있도록 설정
}

function NfcImage({ className = '' }: NfcImageProps) {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('/card-play-select');
  };

  return (
    <div className={`NfcImageContainer ${className}`.trim()}>
      <img
        src="/src/assets/common/nfc_tag.png"
        alt="NFC 태깅 이미지"
        className="NfcImage"
        onClick={handleClick}
      />
    </div>
  );
}

export default NfcImage;
