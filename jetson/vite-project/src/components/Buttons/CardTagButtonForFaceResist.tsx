import { Button } from '@chakra-ui/react';
import '../Texts/TextFontFromGoogle.css';
import UseCardTagForFaceResist from '../../hooks/UseCardTagForFaceResist';
/**
CardTagButtonForFaceResist 컴포넌트
이 컴포넌트는 "Face ID 등록하기" 버튼을 렌더링하며,
버튼 클릭 시 UseCardTagForFaceResist 제공하는 핸들러 함수가 실행되어
서버에서 카드 데이터를 받아온 후 지정된 페이지로 이동하는 처리를 합니다.
*/
export default function CardTagButtonForFaceResist() {
  // custom hook을 사용하여 카드 태깅 관련 비즈니스 로직 핸들러를 가져옵니다.
  const handleCardTagForFaceResist = UseCardTagForFaceResist();
  return (
    <Button
      className="FaceIdRegistrationButton"
      onClick={handleCardTagForFaceResist}
    >
      Face ID 등록하기
    </Button>
  );
}
