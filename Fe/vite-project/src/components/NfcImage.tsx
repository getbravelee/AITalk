import '../styles/NfcImage.css';

function NfcImage() {
  return (
    <div className="NfcImageContainer">
      <img
        src="/src/assets/nfc_tag.png"
        alt="NFC 태깅 이미지"
        className="NfcImage"
      />
    </div>
  );
}

export default NfcImage;
