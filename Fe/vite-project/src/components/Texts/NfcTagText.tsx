import './NfcTagText.css';

interface NfcTagTextProps {
  className?: string; // className을 받을 수 있도록 설정
}

export default function NfcTagText({ className = '' }: NfcTagTextProps) {
  return (
    <div className={`NfcTagTextContainer ${className}`.trim()}>
      <p className="NfcTagText">카드를 태깅해주세요!</p>
    </div>
  );
}
