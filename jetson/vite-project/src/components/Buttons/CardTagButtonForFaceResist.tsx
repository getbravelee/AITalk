import { Button } from '@chakra-ui/react';
import '../Texts/TextFontFromGoogle.css';
import UseCardTagForFaceResist from '../../hooks/UseCardTagForFaceResist';
import { useDispatch } from 'react-redux';
import { setUser } from '../../feature/user/userSlice'; // 실제 경로에 맞게 수정
export default function CardTagButtonForFaceResist() {
  // custom hook을 사용하여 카드 태깅 관련 비즈니스 로직 핸들러를 가져옵니다.
  const handleCardTagForFaceResist = UseCardTagForFaceResist();
  const dispatch = useDispatch();
  const handleTest = () => {
    // 테스트를 위한 유저 생성
    const testUser = {
      id: 1,
      name: '테스트유저',
      therapist_id: 1,
      therapist_name: '테스트유저'
    };
    dispatch(setUser(testUser));
  }


  return (
    <div>
    <Button
      className="FaceIdRegistrationButton"
      onClick={handleCardTagForFaceResist}
    >
      Face ID 등록하기
    </Button>
    <Button
      className="FaceIdRegistrationButton"
      onClick={handleTest}>
        테스트
    </Button>
    </div>
  );
}
