import { Button } from '@chakra-ui/react';
import '../Texts/TextFontFromGoogle.css';
import UseCardTagForFaceResist from '../../hooks/UseCardTagForFaceResist';

export default function CardTagButtonForFaceResist() {
  // custom hook을 사용하여 카드 태깅 관련 비즈니스 로직 핸들러를 가져옵니다.
  const handleCardTagForFaceResist = UseCardTagForFaceResist();
  return (
    <div>
    <Button
      className="FaceIdRegistrationButton"
      onClick={handleCardTagForFaceResist}
    >
      Face ID 등록하기
    </Button>
    </div>
  );
}
