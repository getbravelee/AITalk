import './NfcImage.css';

interface NfcImageProps {
  className?: string; // className을 받을 수 있도록 설정
}

function NfcImage({ className = '' }: NfcImageProps) {
  return (
    <div className={`NfcImageContainer ${className}`.trim()}>
      <img
        src="/images/common/nfc_tag.png"
        alt="NFC 태깅 이미지"
        className="NfcImage"
      />
    </div>
  );
}

export default NfcImage;
