import { Button } from '@chakra-ui/react';
import '../../pages/HomePage.css';
import { UseCardTagLogin } from '../../hooks/UseCardTagLogin';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
/* ---------------------------------------------------------------------------
   메인 컴포넌트: CardTagButtonForLogin
   - 버튼 클릭 시 custom hook의 cardLogin 함수가 호출되어 카드 태깅 로그인을 진행합니다.
--------------------------------------------------------------------------- */
export default function CardTagButtonForLogin() {
  const navigate = useNavigate()
  // 로그인이 완료된 사용자인지 확인인
  const currentUser = useSelector((state: any) => state.user.currentUser);
  // 이미 로그인 완료된 사용자라면 바로 아동 얼굴 인식 페이지로 이동
  if (currentUser) {
    navigate('/KidFaceLoginPage');
    return;
  }
  // custom hook을 통해 로그인 로직 불러오기
  const { cardLogin } = UseCardTagLogin();

  return (
    <Button className="CardLoginButton" onClick={cardLogin}>
      카드 태깅으로 로그인 하기
    </Button>
  );
}
