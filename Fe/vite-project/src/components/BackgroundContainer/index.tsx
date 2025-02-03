import './index.css';

function BackgroundContainer() {
  return (
    <div className="BackgroundContainer">
      {/* 로딩 써클 */}
      <div className="LoadingContainer">
        <div className="LoadingCircle"></div>
      </div>

      {/* NFC 이미지 */}
      <div className="NfcImageContainer">
        <img src="/nfc_tag.png" alt="NFC 태깅 이미지" className="NfcImage" />
      </div>

      {/* 텍스트 */}
      <div className="LoadingTextContainer">
        <p className="LoadingText">카드를 태깅해주세요!</p>
      </div>
    </div>
  );
}

export default BackgroundContainer;
